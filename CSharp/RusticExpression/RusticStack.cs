using System;
using System.Collections.Generic;

namespace ExpressionStack.RusticExpression
{
    internal class RusticStack
    {
        public int displayId;
        public int priority;
        public RusticStack parent;
        public readonly List<RusticOperation> operations = new List<RusticOperation>();
        public bool executed { get; private set; } = false;

        public bool CanBeSimplified => operations.Count == 1 && operations[0] is Operations.Set && operations[0].parameter != null;

        public object ResultValue {
            get {
                if (executed)
                    return result;
                else
                    throw new System.Exception("This stack did not execute yet");
            }
        }

        object result = null;
        Type resultType = null;

        public RusticStack(int id, RusticStack parent, int priority)
        {
            this.displayId = id;
            this.parent = parent;
            this.priority = priority;
        }

        public void Prepare()
        {
            PreviewResultType();
        }

        public void Execute()
        {
            result = 0f;
            for (int i = 0; i < operations.Count; i++)
            {
                result = operations[i].Execute(result);
            }
            executed = true;
        }

        public Type PreviewResultType()
        {
            if (resultType == null)
            {
                for(int i = 0; i < operations.Count; i++)
                {
                    resultType = operations[i].PreviewResultType(resultType);
                }
            }

            return resultType;
        }

        public string ToExpressionString()
        {
            string str = " (";
            for(int i = 0; i < operations.Count; i++)
            {
                str += operations[i].ToExpressionString();
            }
            str += " )";
            return str;
        }
    }
}