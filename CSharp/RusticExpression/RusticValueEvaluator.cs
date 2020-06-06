using System;

namespace ExpressionStack.RusticExpression
{
    abstract class RusticValueEvaluator
    {
        abstract public object GetValue();
        abstract public Type GetValueType();
        public T GetValue<T>() => (T)GetValue();
    }
}
