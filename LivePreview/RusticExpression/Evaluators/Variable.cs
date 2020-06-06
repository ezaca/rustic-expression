using System;

namespace ExpressionStack.RusticExpression.Evaluators
{
    class Variable: RusticValueEvaluator
    {
        RusticContext context;
        int variableId;
        Type variableType;
        public Variable(RusticContext context, int variableId)
        {
            this.context = context;
            this.variableId = variableId;
            variableType = GetValue().GetType();
        }
        public override object GetValue() => context.variables[variableId];
        public override Type GetValueType() => variableType;
        public override string ToString() => $"${variableId}";
    }
}
