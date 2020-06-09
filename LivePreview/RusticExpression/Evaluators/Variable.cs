using System;

namespace ExpressionStack.RusticExpression.Evaluators
{
    class Variable: RusticValueEvaluator
    {
        RusticContext context;
        string variableName;
        Type variableType;
        public Variable(RusticContext context, string variableId)
        {
            this.context = context;
            this.variableName = variableId;
            variableType = GetValue()?.GetType();
        }
        public override object GetValue()
        {
            object value = null;
            if (context?.variables.TryGetValue(variableName, out value) == true)
                return value;
            else
                return null;
                throw new Exception($"Undefined variable \"{variableName}\"");
        }
        public override Type GetValueType() => variableType;
        public override string ToString() => variableName;
    }
}
