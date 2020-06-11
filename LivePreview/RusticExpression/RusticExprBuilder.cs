using System;
using System.Collections.Generic;
using System.Linq;

namespace ExpressionStack.RusticExpression
{
    class RusticExprBuilder
    {
        protected RusticExpr expression;
        protected RusticContext context;
        protected RusticOperation nextOperation;
        protected RusticStack currentStack;
        protected int priorityOffset;

        protected List<RusticStack> stacks => expression?.stacks;

        protected RusticExprBuilder() : this(null, null) { }

        public RusticExprBuilder(RusticExpr expression, RusticContext context)
        {
            if (expression?.stacks.Count > 0)
                throw new Exception("RusticExpr instance was already built and should not be built again. Did you intend to ResetExpression?");

            this.expression = expression;
            this.context = context;
            nextOperation = new Operations.Set();
            priorityOffset = 0;
            stacks?.Add(new RusticStack(0, null, 1));
            currentStack = stacks?[0];
        }

        public RusticExprBuilder(RusticExpr expression, RusticContext context, string expressionLine)
            : this(expression, context)
            => ParseAndPutTokens(expressionLine);

        public RusticExprBuilder(RusticExpr expression, RusticContext context, RusticToken[] tokenList)
            : this(expression, context)
            => PutTokens(tokenList);

        public void ParseAndPutTokens(string expression)
        {
            RusticParser parser = new RusticParser(context);
            PutTokens(Enumerable.ToArray(parser.GetTokenList(expression)));
        }

        public void PutTokens(params RusticToken[] tokens)
        {
            foreach (var token in tokens)
                PutToken(token);
        }

        public void PutToken(RusticToken token)
        {
            switch (token.mode)
            {
                case RusticTokenMode.Literal: PutValueToken(token.value); break;
                case RusticTokenMode.VariableName: PutVariableToken(token.value.ToString()); break;
                case RusticTokenMode.Operation: PutOperationToken((RusticOperation)token.value); break;
                case RusticTokenMode.PriorityOffset: ChangePriority((int)token.value); break;
                default: throw new NotImplementedException();
            }
        }

        private void PutCustomValueToken(RusticValueEvaluator value)
        {
            if (nextOperation == null)
                throw new Exception($"Expecting operator, but received operand ({value.GetType().Name})");
            nextOperation.parameter = value;
            currentStack.operations.Add(nextOperation);
            nextOperation = null;
        }

        private void PutValueToken(object value)
        {
            PutCustomValueToken(new Evaluators.Literal(value));
        }

        private void PutVariableToken(string variableName)
        {
            PutCustomValueToken(new Evaluators.Variable(context, variableName));
        }

        private void ChangePriority(int addition)
        {
            priorityOffset += addition;
            if (addition > 0)
            {
                RusticStack newStack = new RusticStack(stacks.Count, currentStack, priorityOffset + RusticOperation.FirstPriority);
                nextOperation.parameter = new Evaluators.StackReference(newStack);
                currentStack.operations.Add(nextOperation);
                int index = stacks.IndexOf(currentStack);
                stacks.Insert(index + 1, newStack);
                currentStack = newStack;
                nextOperation = new Operations.Set();
            }
        }

        private void PutOperationToken(RusticOperation operation)
        {
            if (nextOperation != null)
            {
                if (operation.IsLeftUnary)
                {
                    PutLeftOperationToken(operation);
                    return;
                }
                else
                    throw new Exception("Unexpected operator found");
            }

            operation.priorityOffset = priorityOffset;
            if (operation.GetPriorityWithOffset() <= (int)RusticOperation.Priority.Ignored)
                PutOperationOfEqualOrIgnoredPriority(operation);
            else
            if ((operation.HasRightToLeftPrecedence() && currentStack.priority <= operation.GetPriorityWithOffset()) || currentStack.priority < operation.GetPriorityWithOffset()) // TO-DO: Alterar para inserir operadores RTL
                PutOperationOfHigherPriority(operation);
            else
            if (currentStack.priority > operation.GetPriorityWithOffset())
                PutOperationOfLowerPriority(operation);
            else
                PutOperationOfEqualOrIgnoredPriority(operation);
        }

        private void PutLeftOperationToken(RusticOperation operation)
        {
            if (currentStack.priority == operation.GetPriorityWithOffset())
            {
                currentStack.operations.Add(operation);
            } else
            {
                RusticStack newStack = new RusticStack(stacks.Count, currentStack, operation.GetPriorityWithOffset());
                newStack.operations.Add(operation);
                int index = stacks.IndexOf(currentStack);
                stacks.Insert(index + 1, newStack);

                PutCustomValueToken(new Evaluators.StackReference(newStack));
                currentStack = newStack;
                nextOperation = new Operations.Set();
            }
        }

        private void PutOperationOfHigherPriority(RusticOperation operation)
        {
            nextOperation = operation;
            RusticOperation lastOperationFromStack = currentStack.operations[currentStack.operations.Count - 1];
            RusticValueEvaluator lastOperationValue = lastOperationFromStack.parameter;
            RusticStack newStack = new RusticStack(stacks.Count, currentStack, operation.GetPriorityWithOffset());
            lastOperationFromStack.parameter = new Evaluators.StackReference(newStack);
            RusticOperation newSetOperation = new Operations.Set();
            newSetOperation.parameter = lastOperationValue;
            newStack.operations.Add(newSetOperation);
            int index = stacks.IndexOf(currentStack);
            stacks.Insert(index + 1, newStack);
            currentStack = newStack;
        }

        private void PutOperationOfLowerPriority(RusticOperation operation)
        {
            nextOperation = operation;
            while (currentStack.priority > operation.GetPriorityWithOffset())
                currentStack = currentStack.parent;

            if (currentStack.priority < operation.GetPriorityWithOffset())
                PutOperationOfHigherPriority(operation);
        }

        private void PutOperationOfEqualOrIgnoredPriority(RusticOperation operation)
        {
            nextOperation = operation;
        }

        public void FinalizeExpression()
        {
            int index = 0;

            foreach (RusticStack stack in stacks)
            {
                stack.displayId = index++;
                stack.Prepare();
            }
        }

        public void SimplifyExpression()
        {
            HashSet<RusticStack> discard = null;
            foreach (RusticStack stack in stacks)
            {
                foreach (RusticOperation operation in stack.operations)
                {
                    Evaluators.StackReference reference = null;
                    bool hasRefParam = operation.parameter != null && (reference = operation.parameter as Evaluators.StackReference) != null;
                    bool canBeSimplified = hasRefParam && reference.stack.CanBeSimplified;
                    if (canBeSimplified)
                    {
                        operation.parameter = reference.stack.operations[0].parameter;
                        discard = discard ?? new HashSet<RusticStack>();
                        discard.Add(reference.stack);
                    }
                }
            }

            if (discard != null)
                foreach (RusticStack item in discard)
                    stacks.Remove(item);

            // Simplify the stack register R0
            if (stacks.Count > 0 && stacks[0].operations.Count == 1)
            {
                RusticOperation set;
                if ((set = stacks[0].operations[0] as Operations.Set) != null)
                {
                    stacks[0].operations.Clear();
                    RusticStack stack = ((Evaluators.StackReference)set.parameter).stack;
                    stacks[0].operations.AddRange(stack.operations);
                    stacks[0].priority = stack.priority;
                    stacks.Remove(stack);
                }
            }
            FinalizeExpression();
        }

        public void FinalizeAndSimplify()
        {
            FinalizeExpression();
            SimplifyExpression();
        }

        static public void SimplifyExpression(RusticExpr expression)
        {
            RusticExprBuilder builder = new RusticExprBuilder();
            builder.expression = expression;
            builder.SimplifyExpression();
        }
    }
}
