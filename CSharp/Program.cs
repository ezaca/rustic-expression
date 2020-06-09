using ExpressionStack.RusticExpression;
using System;
using System.Collections.Generic;

namespace ExpressionStack
{
    class Program
    {
        static void Main(string[] args) => (new Program())._Main(args);

        struct TestExpr
        {
            public string input;
            public object result;
            public string explain;
        }

        List<TestExpr> expressions = new List<TestExpr>()
        {
            new TestExpr(){ input="1 + 1", result = 2 },
            new TestExpr(){ input="(1 + 1)", result = 2 },
            new TestExpr(){ input="2 * (1 + 1f)", result = 4f, explain = "because of parenthesis, and the order of execution makes all Single values." },
            new TestExpr(){ input="2 ** 2 ** 3", result = 256d, explain="64 is invalid because power operator has right precedence." },
        };

        int selectedExpression = 0;

        void _Main(string[] args)
        {
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("en-US");

            bool simplify = false;
            ConsoleKeyInfo key = new ConsoleKeyInfo((char)0, (ConsoleKey)0, false, false, false);
            do
            {
                switch (key.Key)
                {
                    case ConsoleKey.UpArrow: selectedExpression--; simplify = false; break;
                    
                    case ConsoleKey.DownArrow: selectedExpression++; simplify = false; break;
                    
                    case ConsoleKey.Enter:
                    case ConsoleKey.Spacebar: simplify = ! simplify; break;
                    
                    case ConsoleKey.Home: selectedExpression = 0; break;
                    
                    case ConsoleKey.End: selectedExpression = expressions.Count - 1; break;
                }

                if (selectedExpression < 0)
                    selectedExpression = 0;
                else
                if (selectedExpression >= expressions.Count)
                    selectedExpression = expressions.Count - 1;

                Console.ForegroundColor = ConsoleColor.White;
                Console.BackgroundColor = ConsoleColor.Black;
                Console.Clear();
                Console.WriteLine("Test expressions:");
                for (int expId = 0; expId < expressions.Count; expId++)
                {
                    Console.BackgroundColor = selectedExpression == expId ? ConsoleColor.DarkBlue : ConsoleColor.Black;
                    Console.WriteLine($"{(selectedExpression == expId ? " > " : "   ")}{expressions[expId].input} ".PadRight(40));
                }
                Console.WriteLine();
                Console.BackgroundColor = ConsoleColor.Black;

                TestExpr test = expressions[selectedExpression];
                RusticExpr expr = new RusticExpr(test.input);

                if (simplify)
                    RusticExprBuilder.SimplifyExpression(expr);

                object result = expr.Execute();
                Console.WriteLine($"Expectation = {test.result ?? "null"} [{test.result?.GetType().Name}]{(test.explain != null ? $", {test.explain}" : " (no further explanation)")}");
                Console.WriteLine($"Result (R0) = {result} [{result.GetType().Name}]");

                if (result is IComparable && test.result is IComparable)
                    try
                    {
                        Console.WriteLine(((IComparable)result).CompareTo(test.result) == 0 ? "Match" : "/!\\ Values are not equal.");
                    }
                    catch (System.Exception)
                    {
                        Console.WriteLine("Could not compare values automatically");
                    }

                Console.WriteLine();
                expr.PrintDebug();
                if (simplify)
                    Console.WriteLine("Showing simplified version.");
            } while ((key = Console.ReadKey(true)).Key != ConsoleKey.Escape);
        }

        void WaitAndRewrite()
        {
            Console.WriteLine("");
            Console.WriteLine("Pressione qualquer tecla para continuar . . .");
            Console.ReadKey(true);
            Console.Clear();
        }
    }
}
