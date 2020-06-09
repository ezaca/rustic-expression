using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace ExpressionStack.RusticExpression
{
    class RusticParser
    {
        // PriorityGroup
        readonly public List<GenericCapture> OpenGroupPattern = new List<GenericCapture>()
        {
            new GenericCapture("[(]", RusticTokenMode.PriorityOffset, (p,s) => +100),
        };

        readonly public List<GenericCapture> CloseGroupPattern = new List<GenericCapture>()
        {
            new GenericCapture("[)]", RusticTokenMode.PriorityOffset, (p,s) => -100),
        };

        // MiddleOperators
        readonly public List<OperationCapture> MiddleOperators = new List<OperationCapture>()
        {
            new OperationCapture("[*][*]", new Operations.Pow()),
            new OperationCapture("[+]", new Operations.Add()),
            new OperationCapture("[-]", new Operations.Sub()),
            new OperationCapture("[*]", new Operations.Mul()),
            new OperationCapture("[/]", new Operations.Div()),
        };

        // LeftOperators
        readonly public List<OperationCapture> LeftOperators = new List<OperationCapture>()
        {
            new OperationCapture("[+](?![.0-9])", new Operations.PrefixUnary.Positive()),
            new OperationCapture("[-](?![.0-9])", new Operations.PrefixUnary.Negative()),
        };

        // ValuePattern
        readonly public List<GenericCapture> ValuePattern = new List<GenericCapture>()
        {
            new GenericCapture(@"[-+]?[0-9]+[Xx%]?(?![.]\d|\w)", RusticTokenMode.Literal, (parser, value) => StringToInt32(value, 'X', 'x', '%')),
            new GenericCapture(@"[-+]?[0-9]+(?:[.][0-9]+)?(?:[Ee][-+]?[0-9]+)?[FfXx%](?!\w)", RusticTokenMode.Literal, (parser, value) => StringToFloat(value, 'F', 'f', 'X', 'x', '%')),
            new GenericCapture(@"[-+]?[0-9]*[.][0-9]+(?:[Ee][-+]?[0-9]+)?[FfXx%](?!\w)", RusticTokenMode.Literal, (parser, value) => StringToFloat(value, 'F', 'f', 'X', 'x', '%')),
            new GenericCapture(@"[-+]?[0-9]+(?:[.][0-9]+)?(?:[Ee][-+]?[0-9]+)?[Dd]?(?!\w)", RusticTokenMode.Literal, (parser, value) => StringToDouble(value, 'D', 'd')),
            new GenericCapture(@"[-+]?[0-9]*[.][0-9]+(?:[Ee][-+]?[0-9]+)?[Dd]?(?!\w)", RusticTokenMode.Literal, (parser, value) => StringToDouble(value, 'D', 'd')),
            new GenericCapture(@"[A-Za-z_]\w*", RusticTokenMode.VariableName, (parser, value) => new Evaluators.Variable(parser.context, value)),
        };

        readonly public List<string> IgnoredPattern = new List<string>()
        {
            @"\s+",
        };

        bool initialized = false;
        RusticContext context;
        Regex valueExpr;
        Regex leftOpExpr;
        Regex midOpExpr;
        Regex ignoredExpr;
        Regex openGroupExpr;
        Regex closeGroupExpr;
        Regex unexpectedTokenExpr = new Regex(@"\s*([-$.\w]+|[^\w\s])");

        Stack<ParsingState> currentState = new Stack<ParsingState>();

        public RusticParser(RusticContext context)
        {
            this.context = context;
        }

        public void Initialize()
        {
            RegexOptions options = RegexOptions.None;
            valueExpr = new Regex($"({ string.Join(")|(", ValuePattern.ConvertAll(v => v.pattern)) })", options);
            leftOpExpr = new Regex($"({ string.Join(")|(", LeftOperators.ConvertAll(v => v.pattern)) })", options);
            midOpExpr = new Regex($"({ string.Join(")|(", MiddleOperators.ConvertAll(v => v.pattern)) })", options);
            openGroupExpr = new Regex($"({string.Join(")|(", OpenGroupPattern.ConvertAll(v => v.pattern))})", options);
            closeGroupExpr = new Regex($"({string.Join(")|(", CloseGroupPattern.ConvertAll(v => v.pattern))})", options);
            ignoredExpr = new Regex($"({string.Join(")|(", IgnoredPattern)})", options);
        }

        public IEnumerable<RusticToken> GetTokenList(string expression)
        {
            if (initialized == false)
                Initialize();

            int index = 0;
            expression.Trim();
            currentState.Clear();
            currentState.Push(ParsingState.ValueOrLeftOperatorOrEnd);

            while(currentState.Count > 0)
            {
                TryCaptureIgnoredPattern(expression, ref index);

                RusticToken result = null;
                switch (currentState.Pop())
                {
                    case ParsingState.ValueOrLeftOperatorOrEnd: result = TryCaptureValueOrLeftOperator(expression, ref index); break;
                    case ParsingState.ValueOrLeftOperatorExpected: result = CaptureValueOrLeftOperator(expression, ref index); break;
                    case ParsingState.MiddleOperatorOrEnd: result = TryCaptureMiddleOperator(expression, ref index); break;
                }

                if (result != null)
                    yield return result;
            }

            TryCaptureIgnoredPattern(expression, ref index);
            if (index < expression.Length)
                throw new Exception($"Unexpected sequence of characters: {expression.Substring(index)}");
        }

        RusticToken TryCaptureValueOrLeftOperator(string expression, ref int index, bool canEndGroups = true)
        {
            Match match;
            if ((match = StickyMatch(openGroupExpr, expression, ref index)).Success)
            {
                currentState.Push(ParsingState.ValueOrLeftOperatorOrEnd);
                return OpenGroupPattern[FindSuccededGroupIndex(match) - 1].ToToken(this, match.Value);
            }

            if ((match = StickyMatch(leftOpExpr, expression, ref index)).Success)
            {
                currentState.Push(ParsingState.ValueOrLeftOperatorExpected);
                return LeftOperators[FindSuccededGroupIndex(match) - 1].ToToken();
            }

            if ((match = StickyMatch(valueExpr, expression, ref index)).Success)
            {
                currentState.Push(ParsingState.MiddleOperatorOrEnd);
                return ValuePattern[FindSuccededGroupIndex(match) - 1].ToToken(this, match.Value);
            }

            if (canEndGroups && (match = StickyMatch(closeGroupExpr, expression, ref index)).Success)
            {
                currentState.Push(ParsingState.MiddleOperatorOrEnd);
                return CloseGroupPattern[FindSuccededGroupIndex(match) - 1].ToToken(this, match.Value);
            }

            return null;
        }
        
        RusticToken CaptureValueOrLeftOperator(string expression, ref int index)
        {
            RusticToken result = TryCaptureValueOrLeftOperator(expression, ref index, canEndGroups: false);
            if (result == null)
                throw new Exception("Unexpected token: "+unexpectedTokenExpr.Match(expression, index));
            return result;
        }

        RusticToken TryCaptureMiddleOperator(string expression, ref int index, bool canEndGroups = true)
        {
            Match match;
            if ((match = StickyMatch(midOpExpr, expression, ref index)).Success)
            {
                currentState.Push(ParsingState.ValueOrLeftOperatorExpected);
                return MiddleOperators[FindSuccededGroupIndex(match) - 1].ToToken();
            }

            if (canEndGroups && (match = StickyMatch(closeGroupExpr, expression, ref index)).Success)
            {
                currentState.Push(ParsingState.MiddleOperatorOrEnd);
                return CloseGroupPattern[FindSuccededGroupIndex(match) - 1].ToToken(this, match.Value);
            }

            return null;
        }

        void TryCaptureIgnoredPattern(string expression, ref int index)
            => StickyMatch(ignoredExpr, expression, ref index);

        static object StringToInt32(string value, params char[] trimChars)
        {
            int intValue = Convert.ToInt32(value.TrimEnd(trimChars));
            if (value.EndsWith("%"))
                return intValue / 100f;
            return Convert.ToInt32(intValue);
        }

        static object StringToFloat(string value, params char[] trimChars)
        {
            float floatValue = Convert.ToSingle((value.StartsWith(".") ? "0" : "") + value.TrimEnd(trimChars));
            if (value.EndsWith("%"))
                return floatValue / 100f;
            return floatValue;
        }

        static object StringToDouble(string value, params char[] trimChars)
        {
            double doubleValue = Convert.ToSingle(value.TrimEnd(trimChars));
            if (value.EndsWith("%"))
                return doubleValue / 100d;
            return doubleValue;
        }

        static Match StickyMatch(Regex regex, string input, ref int index)
        {
            Match match = regex.Match(input, index);
            if (match.Index != index)
                return Match.Empty;

            index = match.Index + match.Length;
            return match;
        }

        static int FindSuccededGroupIndex(Match match)
        {
            if (match.Success == false)
                return -1;

            for (int i = 1; i < match.Groups.Count; i++)
            {
                if (match.Groups[i].Success)
                    return i;
            }

            return 0;
        }

        public class OperationCapture
        {
            public string pattern;
            public RusticOperation operation;
            public OperationCapture(string pattern, RusticOperation operation)
            {
                this.pattern = pattern;
                this.operation = operation;
            }
            public RusticToken ToToken() => new RusticToken(RusticTokenMode.Operation, Activator.CreateInstance(operation.GetType()));
        }

        public class GenericCapture
        {
            public string pattern;
            public Func<RusticParser, string,object> value;
            public RusticTokenMode mode;
            public GenericCapture(string pattern, RusticTokenMode mode, Func<RusticParser, string,object> value)
            {
                this.pattern = pattern;
                this.value = value;
                this.mode = mode;
            }
            public RusticToken ToToken(RusticParser parser, string captured)
            {
                object result = value(parser, captured);
                return result is RusticToken token ? token : new RusticToken(mode, result);
            }
        }

        public enum ParsingState
        {
            /// <summary>
            /// The expression expects a value or may be empty, like in ( )
            /// 
            /// <para>
            /// Next state:<br />
            ///   - On value found: <see cref="MiddleOperatorOrEnd" />.<br />
            ///   - On left operator found: <see cref="ValueOrLeftOperatorExpected"/><br />
            /// </para>
            /// </summary>
            ValueOrLeftOperatorOrEnd,

            /// <summary>
            /// The expression expects a value, like in A + B + ?
            /// 
            /// <para>
            /// Next state:<br />
            ///   - On value found: <see cref="MiddleOperatorOrEnd" />.<br />
            ///   - On left operator found: <see cref="ValueOrLeftOperatorExpected"/><br />
            /// </para>
            /// </summary>
            ValueOrLeftOperatorExpected,

            /// <summary>
            /// The expression expects a middle operator or the end of the expression, like in A + B ?
            /// 
            /// <para>
            /// Next state:<br />
            ///   - On operator found: <see cref="ValueOrLeftOperatorOrEnd" />.<br />
            /// </para>
            /// </summary>
            MiddleOperatorOrEnd,
        }
    }
}
