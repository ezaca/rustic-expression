using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpressionStack.RusticExpression.Operations.Providers
{
    static class CommonMath
    {
        static public Dictionary<Type, Func<object, object, object>> Add = new Dictionary<Type, Func<object, object, object>>()
        {
            { typeof(float), AddSingle },
            { typeof(double), AddDouble },
            { typeof(int), AddInt32 }
        };

        static object AddSingle(object a, object b) => Convert.ToSingle(a) + Convert.ToSingle(b);
        static object AddDouble(object a, object b) => Convert.ToDouble(a) + Convert.ToDouble(b);
        static object AddInt32(object a, object b) => Convert.ToInt32(a) + Convert.ToInt32(b);

        static public Dictionary<Type, Func<object, object, object>> Sub = new Dictionary<Type, Func<object, object, object>>()
        {
            { typeof(float), SubSingle },
            { typeof(double), SubDouble },
            { typeof(int), SubInt32 }
        };

        static object SubSingle(object a, object b) => Convert.ToSingle(a) - Convert.ToSingle(b);
        static object SubDouble(object a, object b) => Convert.ToDouble(a) - Convert.ToDouble(b);
        static object SubInt32(object a, object b) => Convert.ToInt32(a) - Convert.ToInt32(b);

        static public Dictionary<Type, Func<object, object, object>> Mul = new Dictionary<Type, Func<object, object, object>>()
        {
            { typeof(float), MulSingle },
            { typeof(double), MulDouble },
            { typeof(int), MulInt32 }
        };

        static object MulSingle(object a, object b) => Convert.ToSingle(a) * Convert.ToSingle(b);
        static object MulDouble(object a, object b) => Convert.ToDouble(a) * Convert.ToDouble(b);
        static object MulInt32(object a, object b) => Convert.ToInt32(a) * Convert.ToInt32(b);

        static public Dictionary<Type, Func<object, object, object>> Div = new Dictionary<Type, Func<object, object, object>>()
        {
            { typeof(float), DivSingle },
            { typeof(double), DivDouble },
            { typeof(int), DivInt32 }
        };

        static object DivSingle(object a, object b) => Convert.ToSingle(a) / Convert.ToSingle(b);
        static object DivDouble(object a, object b) => Convert.ToDouble(a) / Convert.ToDouble(b);
        static object DivInt32(object a, object b) => Convert.ToInt32(a) / Convert.ToInt32(b);

        static public object IntDiv(object a, object b) => Convert.ToInt32(a) / Convert.ToInt32(b);

        static public Dictionary<Type, Func<object, object, object>> Mod = new Dictionary<Type, Func<object, object, object>>()
        {
            { typeof(float), ModSingle },
            { typeof(double), ModDouble },
            { typeof(int), ModInt32 }
        };

        static object ModSingle(object a, object b) => Convert.ToSingle(a) % Convert.ToSingle(b);
        static object ModDouble(object a, object b) => Convert.ToDouble(a) % Convert.ToDouble(b);
        static object ModInt32(object a, object b) => Convert.ToInt32(a) % Convert.ToInt32(b);
    }
}
