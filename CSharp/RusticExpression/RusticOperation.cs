using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression
{
    abstract class RusticOperation
    {
        public RusticValueEvaluator parameter { get; set; }
        public object parameterValue => parameter.GetValue();
        public Type parameterType => parameter?.GetValueType();
        public int priorityOffset;
        abstract public object Execute(object stored);
        abstract public Type PreviewResultType(Type incomingStoredType);
        protected abstract Priority GetPriority();
        public int GetPriorityWithOffset() => (int)GetPriority() + priorityOffset;
        public bool HasIncreasedPriority() => (parameter != null) && (parameter is Evaluators.StackReference);
        public override string ToString() => $"{GetType().Name}{(parameter != null ? parameter.GetType().Name : "")}";
        public virtual string ToExpressionString() => $" {GetType().Name}{(parameter != null ? " " + parameterValue : "")}";

        public const int FirstPriority = 1; // This is the value of the lower priority operation (except those that doesn't have priority and are set to -999999 or something like that).
        public enum Priority
        {
            Ignored = -999999,
            AddSub = 1,
            MulDiv = 2,
            Pow = 3,

            Parenthesis = 20,
        }
    }
}