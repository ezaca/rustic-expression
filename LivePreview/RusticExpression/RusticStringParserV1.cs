using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace ExpressionStack.RusticExpression
{
    static class RusticStringParserV1
    {
        static List<ExprType> customTypes = new List<ExprType>()
        {
            new ExprType(@" +", RustickTokenMode.Ignored, null),
            new ExprType(@"\(|\)", RustickTokenMode.PriorityOffset, token => token == "(" ? +(int)RusticOperation.Priority.Parenthesis : -(int)RusticOperation.Priority.Parenthesis),
            new ExprType(@"[_A-Za-z]\w*", RustickTokenMode.VariableName, token => token),
            new ExprType(@"[-+]?\d+[%Xx]?(?![\w.])", RustickTokenMode.Literal, token => NumberFromString<int>(token, '%', 'X', 'x')),
            new ExprType(@"[-+]?[0-9]+(?:\.[0-9]+)?(?:[Ee][-+]?[0-9]+)?[FfXx%]|[-+]?\.[0-9]+(?:[Ee][-+]?[0-9]+)?[FfXx%]", RustickTokenMode.Literal, token => NumberFromString<float>(token, '%', 'F', 'f', 'X', 'x')),
            new ExprType(@"[-+]?[0-9]+(?:\.[0-9]+)?(?:[Ee][-+]?[0-9]+)?[Dd]?|[-+]?\.[0-9]+(?:[Ee][-+]?[0-9]+)?[Dd]?", RustickTokenMode.Literal, token => NumberFromString<double>(token, 'd')),
            new ExprType(@"[*][*]|[-+*/]|\b(?:mod|div)\b", RustickTokenMode.Operation, token => OperationFromString(token)),
        };

        const string errorPattern = @"\s*(?:\w+|\W+)|.+";
        readonly static Regex regex;

        static RusticStringParserV1()
        {
            string pattern = "";
            foreach(var customType in customTypes)
            {
                pattern += $"({customType.pattern})|";
            }
            pattern += $"({errorPattern})";
            regex = new Regex(pattern);

            if (regex.GetGroupNumbers().Length != customTypes.Count + 2)
                throw new Exception("RusticStringExpr has invalid number of groups, probably due to custom types with capturing groups");
        }

        static public IEnumerable<RusticToken> GetTokenList(string expression)
        {
            expression += " ";
            MatchCollection matches = regex.Matches(expression);

            foreach(Match match in matches)
            {
                bool executed = false;
                for(int i = 0; i < customTypes.Count; i++)
                {
                    if (match.Groups[i + 1].Success)
                    {
                        executed = true;
                        if (customTypes[i].mode != RustickTokenMode.Ignored)
                            yield return new RusticToken(customTypes[i].mode, customTypes[i].parse(match.Groups[i + 1].Value));
                        break;
                    }
                }

                if (! executed)
                {
                    if (match.Groups[customTypes.Count + 1].Success)
                        throw new Exception($"Unexpected token: {match.Groups[customTypes.Count + 1].Value}");
                    else
                        throw new Exception($"Unexpected token: {match.Value}");
                }
            }
        }
        
        static object NumberFromString<T>(string token, params char[] trimEnd)
        {
            string trimmed = token.TrimEnd(trimEnd);
            object value = Convert.ChangeType(trimmed, typeof(T));
            if (token.EndsWith("%"))
            {
                value = Operations.Providers.CommonMath.Div[value.GetType()](value, 100f);
            }
            return value;
        }

        static RusticOperation OperationFromString(string token)
        {
            switch (token)
            {
                case "+": return new Operations.Add();
                case "-": return new Operations.Sub();
                case "*": return new Operations.Mul();
                case "/": return new Operations.Div();
                case "**": return new Operations.Pow();
                default: throw new NotImplementedException($"Operation {token} is not implemented");
            }
        }

        public class ExprType
        {
            public string pattern;
            public RustickTokenMode mode;
            public Func<string, object> parse;

            /// <summary>
            /// Create a new expression type to include in the regular expression pattern and results.
            /// </summary>
            /// <param name="pattern">Regular expression to consume the token. DO NOT USE GROUPS ( ) HERE! Use non-capturing groups (?: ) instead</param>
            /// <param name="mode">How do you intend to use this token.</param>
            /// <param name="parse">A function to enter the string token and get the literal object.</param>
            public ExprType(string pattern, RustickTokenMode mode, Func<string, object> parse)
            {
                this.pattern = pattern;
                this.mode = mode;
                this.parse = parse;
            }
        }
    }
}
