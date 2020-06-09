using System;

namespace ExpressionStack.RusticExpression.Operations.PrefixUnary
{
    class Positive : RusticOperation
    {
        Func<object, object, object> func;

        public override object Execute(object stored) => func(stored, null);

        protected override Priority GetPriority() => Priority.PrefixUnary;

        public override Type PreviewResultType(Type incomingStoredType)
        {
            if (incomingStoredType == typeof(double) || parameterType == typeof(double))
            {
                func = Providers.CommonMath.Positive[typeof(double)];
                return typeof(double);
            }
            else if (incomingStoredType == typeof(float) || parameterType == typeof(float))
            {
                func = Providers.CommonMath.Positive[typeof(float)];
                return typeof(float);
            }
            else
            {
                func = Providers.CommonMath.Positive[typeof(int)];
                return typeof(int);
            }
        }

        public override string ToExpressionString() => $"";
    }
}
