﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression.Operations
{
    class Sub : RusticOperation
    {
        Func<object, object, object> func;

        public override object Execute(object stored) => func(stored, parameterValue);

        protected override Priority GetPriority() => Priority.AddSub;

        public override Type PreviewResultType(Type incomingStoredType)
        {
            if (incomingStoredType == typeof(double) || parameterType == typeof(double))
            {
                func = Providers.CommonMath.Sub[typeof(double)];
                return typeof(double);
            }
            else if (incomingStoredType == typeof(float) || parameterType == typeof(float))
            {
                func = Providers.CommonMath.Sub[typeof(float)];
                return typeof(float);
            }
            else if (incomingStoredType == typeof(int) && parameterType == typeof(int))
            {
                func = Providers.CommonMath.Sub[typeof(int)];
                return typeof(int);
            }
            else
                throw new NotImplementedException("Could not infer the resulting type");
        }
        public override string ToExpressionString() => $" - { parameter?.ToString() }";
    }
}
