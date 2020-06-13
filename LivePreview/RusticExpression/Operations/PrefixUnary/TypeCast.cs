using System;

namespace ExpressionStack.RusticExpression.Operations.PrefixUnary
{
    class TypeCast : RusticOperation
    {
        Type referenceType;

        public TypeCast(Type referenceType) : base()
        {
            this.referenceType = referenceType;
        }

        public override object Execute(object stored) => Convert.ChangeType(stored, referenceType);

        protected override Priority GetPriority() => Priority.PrefixUnary;

        public override Type PreviewResultType(Type incomingStoredType) => referenceType;

        public override string ToExpressionString() => $" ({referenceType.Name})";
    }
}
