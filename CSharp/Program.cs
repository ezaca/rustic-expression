using ExpressionStack.RusticExpression;
using System;

namespace ExpressionStack
{
    class Program
    {
        static void Main(string[] args) => (new Program())._Main(args);

        void _Main(string[] args)
        {
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("en-US");

            RusticExpr expr = new RusticExpr("1.0f + 2 * (3 + 4) + (5 + (2) - 2) * 2");
            // 1 + 2 * (3 + 4) + (5 + (2) - 2) * 2
            // 1 + 2 * 7 + (5 + 2 - 2) * 2
            // 1 + 2 * 7 + 5 * 2
            // 1 + 14 + 10
            // 15 + 10
            // 25

            /*
             * R0:  set 1
             *      add R1
             *      add R5
             * R1:  set 2
             *      mul R2
             * R2:  set 3
             *      add 4
             * R3:  set 5
             *      add R4
             *      sub 2
             * R4:  set 2
             * R5:  set R3
             *      mul 2
             */
            

            object result = expr.Execute();
            Console.WriteLine($"Result (R0) = {result} [{result.GetType().Name}]");
            Console.WriteLine();
            expr.PrintDebug();
            while (Console.ReadKey(true).Key != ConsoleKey.Escape)
                continue;
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
