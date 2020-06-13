/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2020
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("LivePreview", function ($asm, globals) {
    "use strict";

    Bridge.define("ExpressionStack.RusticExpression.DebugExtension", {
        statics: {
            methods: {
                PrintDebug: function (expression) {
                    var $t, $t1, $t2, $t3, $t4;
                    var stacks = expression.stacks;
                    for (var r = (stacks.Count - 1) | 0; r >= 0; r = (r - 1) | 0) {
                        System.Console.WriteLine((System.String.alignString(System.String.format("R{0} [P={1}]:", Bridge.box(r, System.Int32), Bridge.box(stacks.getItem(r).priority, System.Int32)), -30) || "") + (stacks.getItem(r).ToExpressionString() || ""));
                        if (stacks.getItem(r).operations.Count === 0) {
                            System.Console.WriteLine(System.String.format("No operations found.", null));
                        } else {
                            var prevType = null;
                            for (var i = 0; i < stacks.getItem(r).operations.Count; i = (i + 1) | 0) {
                                var operation = stacks.getItem(r).operations.getItem(i);
                                System.Console.WriteLine((System.String.alignString(System.String.format("  {0} RX{1}", Bridge.Reflection.getTypeName(Bridge.getType(operation)), (operation.parameter == null ? "" : System.String.concat(", ", operation.parameter))), -30) || "") + (System.String.format("  # {0}({1}, {2}): {3}", Bridge.Reflection.getTypeName(Bridge.getType(operation)), ($t = (prevType != null ? Bridge.Reflection.getTypeName(prevType) : null), $t != null ? $t : "null"), ($t1 = (($t2 = operation.parameterType) != null ? Bridge.Reflection.getTypeName($t2) : null), $t1 != null ? $t1 : "null"), Bridge.Reflection.getTypeName(operation.PreviewResultType(prevType))) || ""));
                                prevType = operation.PreviewResultType(prevType);
                            }
                        }

                        if (stacks.getItem(r).executed) {
                            System.Console.WriteLine((System.String.alignString(System.String.format("  ResultValue {0}", [stacks.getItem(r).ResultValue]), -30) || "") + (System.String.format("  # {0}", [($t3 = (($t4 = stacks.getItem(r).ResultValue) != null ? Bridge.Reflection.getTypeName(Bridge.getType($t4)) : null), $t3 != null ? $t3 : "null")]) || ""));
                        }
                        System.Console.WriteLine();
                    }
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticValueEvaluator", {
        methods: {
            GetValue: function (T) {
                return Bridge.cast(Bridge.unbox(this.GetValue$1(), T), T);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticOperation", {
        statics: {
            fields: {
                FirstPriority: 0
            },
            ctors: {
                init: function () {
                    this.FirstPriority = 1;
                }
            }
        },
        fields: {
            parameter: null,
            priorityOffset: 0
        },
        props: {
            parameterValue: {
                get: function () {
                    return this.parameter.GetValue$1();
                }
            },
            parameterType: {
                get: function () {
                    var $t;
                    return ($t = this.parameter) != null ? $t.GetValueType() : null;
                }
            },
            IsLeftUnary: {
                get: function () {
                    return this.GetPriority() === ExpressionStack.RusticExpression.RusticOperation.Priority.PrefixUnary;
                }
            }
        },
        methods: {
            GetPriorityWithOffset: function () {
                return ((this.GetPriority() + this.priorityOffset) | 0);
            },
            HasIncreasedPriority: function () {
                return (this.parameter != null) && (Bridge.is(this.parameter, ExpressionStack.RusticExpression.Evaluators.StackReference));
            },
            toString: function () {
                return System.String.format("{0}{1}", Bridge.Reflection.getTypeName(Bridge.getType(this)), (this.parameter != null ? Bridge.Reflection.getTypeName(Bridge.getType(this.parameter)) : ""));
            },
            ToExpressionString: function () {
                return System.String.format(" {0}{1}", Bridge.Reflection.getTypeName(Bridge.getType(this)), (this.parameter != null ? System.String.concat(" ", this.parameterValue) : ""));
            },
            HasRightToLeftPrecedence: function () {
                return false;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Providers.CommonMath", {
        statics: {
            fields: {
                Negative: null,
                Positive: null,
                Add: null,
                Sub: null,
                Mul: null,
                Div: null,
                Mod: null
            },
            ctors: {
                init: function () {
                    this.Negative = function (_o1) {
                            _o1.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.NegativeSingle);
                            _o1.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.NegativeDouble);
                            _o1.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.NegativeInt32);
                            return _o1;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Positive = function (_o2) {
                            _o2.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.PositiveSingle);
                            _o2.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.PositiveDouble);
                            _o2.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.PositiveInt32);
                            return _o2;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Add = function (_o3) {
                            _o3.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.AddSingle);
                            _o3.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.AddDouble);
                            _o3.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.AddInt32);
                            return _o3;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Sub = function (_o4) {
                            _o4.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.SubSingle);
                            _o4.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.SubDouble);
                            _o4.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.SubInt32);
                            return _o4;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Mul = function (_o5) {
                            _o5.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.MulSingle);
                            _o5.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.MulDouble);
                            _o5.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.MulInt32);
                            return _o5;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Div = function (_o6) {
                            _o6.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.DivSingle);
                            _o6.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.DivDouble);
                            _o6.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.DivInt32);
                            return _o6;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                    this.Mod = function (_o7) {
                            _o7.add(System.Single, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.ModSingle);
                            _o7.add(System.Double, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.ModDouble);
                            _o7.add(System.Int32, ExpressionStack.RusticExpression.Operations.Providers.CommonMath.ModInt32);
                            return _o7;
                        }(new (System.Collections.Generic.Dictionary$2(System.Type,Function)).ctor());
                }
            },
            methods: {
                NegativeSingle: function (a, b) {
                    return Bridge.box(-System.Convert.toSingle(a), System.Single, System.Single.format, System.Single.getHashCode);
                },
                NegativeDouble: function (a, b) {
                    return Bridge.box(-System.Convert.toDouble(a), System.Double, System.Double.format, System.Double.getHashCode);
                },
                NegativeInt32: function (a, b) {
                    return Bridge.box(((-System.Convert.toInt32(a)) | 0), System.Int32);
                },
                PositiveSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a), System.Single, System.Single.format, System.Single.getHashCode);
                },
                PositiveDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a), System.Double, System.Double.format, System.Double.getHashCode);
                },
                PositiveInt32: function (a, b) {
                    return Bridge.box(System.Convert.toInt32(a), System.Int32);
                },
                AddSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) + System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                AddDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) + System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                AddInt32: function (a, b) {
                    return Bridge.box(((System.Convert.toInt32(a) + System.Convert.toInt32(b)) | 0), System.Int32);
                },
                SubSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) - System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                SubDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) - System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                SubInt32: function (a, b) {
                    return Bridge.box(((System.Convert.toInt32(a) - System.Convert.toInt32(b)) | 0), System.Int32);
                },
                MulSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) * System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                MulDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) * System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                MulInt32: function (a, b) {
                    return Bridge.box(Bridge.Int.mul(System.Convert.toInt32(a), System.Convert.toInt32(b)), System.Int32);
                },
                DivSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) / System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                DivDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) / System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                DivInt32: function (a, b) {
                    return Bridge.box(((Bridge.Int.div(System.Convert.toInt32(a), System.Convert.toInt32(b))) | 0), System.Int32);
                },
                IntDiv: function (a, b) {
                    return Bridge.box(((Bridge.Int.div(System.Convert.toInt32(a), System.Convert.toInt32(b))) | 0), System.Int32);
                },
                ModSingle: function (a, b) {
                    return Bridge.box(System.Convert.toSingle(a) % System.Convert.toSingle(b), System.Single, System.Single.format, System.Single.getHashCode);
                },
                ModDouble: function (a, b) {
                    return Bridge.box(System.Convert.toDouble(a) % System.Convert.toDouble(b), System.Double, System.Double.format, System.Double.getHashCode);
                },
                ModInt32: function (a, b) {
                    return Bridge.box(System.Convert.toInt32(a) % System.Convert.toInt32(b), System.Int32);
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticContext", {
        fields: {
            expression: null,
            variables: null,
            availableTypeCasts: null
        },
        props: {
            stack: {
                get: function () {
                    return this.expression.stacks;
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticExpr", {
        statics: {
            fields: {
                PreferSimplifiedExpression: false
            },
            ctors: {
                init: function () {
                    this.PreferSimplifiedExpression = false;
                }
            },
            methods: {
                GetVariableID: function (name) {
                    return Bridge.getHashCode(name);
                }
            }
        },
        fields: {
            stacks: null,
            context: null
        },
        ctors: {
            init: function () {
                this.stacks = new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticStack)).ctor();
            },
            ctor: function () {
                this.$initialize();
                this.ResetExpression();
            },
            $ctor1: function (context) {
                ExpressionStack.RusticExpression.RusticExpr.ctor.call(this);
                this.context = context;
            },
            $ctor2: function (expression) {
                ExpressionStack.RusticExpression.RusticExpr.ctor.call(this);
                this.SetExpression(expression);
            },
            $ctor3: function (expression, context) {
                ExpressionStack.RusticExpression.RusticExpr.ctor.call(this);
                this.context = context;
                this.SetExpression(expression);
            }
        },
        methods: {
            ResetExpression: function () {
                this.stacks.clear();
                this.context = new ExpressionStack.RusticExpression.RusticContext();
            },
            SetExpression: function (expression) {
                if (ExpressionStack.RusticExpression.RusticExpr.PreferSimplifiedExpression) {
                    new ExpressionStack.RusticExpression.RusticExprBuilder.$ctor3(this, this.context, expression).FinalizeAndSimplify();
                } else {
                    new ExpressionStack.RusticExpression.RusticExprBuilder.$ctor3(this, this.context, expression).FinalizeExpression();
                }
            },
            Execute: function () {
                for (var r = (this.stacks.Count - 1) | 0; r >= 0; r = (r - 1) | 0) {
                    this.stacks.getItem(r).Execute();
                }

                return this.stacks.getItem(0).ResultValue;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticExprBuilder", {
        statics: {
            methods: {
                SimplifyExpression: function (expression) {
                    var builder = new ExpressionStack.RusticExpression.RusticExprBuilder.ctor();
                    builder.expression = expression;
                    builder.SimplifyExpression();
                }
            }
        },
        fields: {
            expression: null,
            context: null,
            nextOperation: null,
            currentStack: null,
            priorityOffset: 0
        },
        props: {
            stacks: {
                get: function () {
                    return this.expression != null ? this.expression.stacks : null;
                }
            }
        },
        ctors: {
            ctor: function () {
                ExpressionStack.RusticExpression.RusticExprBuilder.$ctor1.call(this, null, null);
            },
            $ctor1: function (expression, context) {
                var $t, $t1;
                this.$initialize();
                if (System.Nullable.gt((expression != null ? expression.stacks.Count : null), 0)) {
                    throw new System.Exception("RusticExpr instance was already built and should not be built again. Did you intend to ResetExpression?");
                }

                this.expression = expression;
                this.context = context;
                this.nextOperation = new ExpressionStack.RusticExpression.Operations.Set();
                this.priorityOffset = 0;
                ($t = this.stacks) != null ? $t.add(new ExpressionStack.RusticExpression.RusticStack(0, null, 1)) : null;
                this.currentStack = ($t1 = this.stacks) != null ? $t1.getItem(0) : null;
            },
            $ctor3: function (expression, context, expressionLine) {
                ExpressionStack.RusticExpression.RusticExprBuilder.$ctor1.call(this, expression, context);
                this.ParseAndPutTokens(expressionLine);
            },
            $ctor2: function (expression, context, tokenList) {
                ExpressionStack.RusticExpression.RusticExprBuilder.$ctor1.call(this, expression, context);
                this.PutTokens(tokenList);
            }
        },
        methods: {
            ParseAndPutTokens: function (expression) {
                var $t;
                var parser = new ExpressionStack.RusticExpression.RusticParser(this.context);
                this.PutTokens(($t = ExpressionStack.RusticExpression.RusticToken, System.Linq.Enumerable.from(parser.GetTokenList(expression), $t).ToArray($t)));
            },
            PutTokens: function (tokens) {
                var $t;
                if (tokens === void 0) { tokens = []; }
                $t = Bridge.getEnumerator(tokens);
                try {
                    while ($t.moveNext()) {
                        var token = $t.Current;
                        this.PutToken(token);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            PutToken: function (token) {
                switch (token.mode) {
                    case ExpressionStack.RusticExpression.RusticTokenMode.Literal: 
                        this.PutValueToken(token.value);
                        break;
                    case ExpressionStack.RusticExpression.RusticTokenMode.VariableName: 
                        this.PutVariableToken(Bridge.toString(token.value));
                        break;
                    case ExpressionStack.RusticExpression.RusticTokenMode.Operation: 
                        this.PutOperationToken(Bridge.cast(token.value, ExpressionStack.RusticExpression.RusticOperation));
                        break;
                    case ExpressionStack.RusticExpression.RusticTokenMode.PriorityOffset: 
                        this.ChangePriority(System.Nullable.getValue(Bridge.cast(Bridge.unbox(token.value, System.Int32), System.Int32)));
                        break;
                    default: 
                        throw new System.NotImplementedException.ctor();
                }
            },
            PutCustomValueToken: function (value) {
                if (this.nextOperation == null) {
                    throw new System.Exception(System.String.format("Expecting operator, but received operand ({0})", [Bridge.Reflection.getTypeName(Bridge.getType(value))]));
                }
                this.nextOperation.parameter = value;
                this.currentStack.operations.add(this.nextOperation);
                this.nextOperation = null;
            },
            PutValueToken: function (value) {
                this.PutCustomValueToken(new ExpressionStack.RusticExpression.Evaluators.Literal(value));
            },
            PutVariableToken: function (variableName) {
                this.PutCustomValueToken(new ExpressionStack.RusticExpression.Evaluators.Variable(this.context, variableName));
            },
            ChangePriority: function (addition) {
                this.priorityOffset = (this.priorityOffset + addition) | 0;
                if (addition > 0) {
                    var newStack = new ExpressionStack.RusticExpression.RusticStack(this.stacks.Count, this.currentStack, ((this.priorityOffset + ExpressionStack.RusticExpression.RusticOperation.FirstPriority) | 0));
                    this.nextOperation.parameter = new ExpressionStack.RusticExpression.Evaluators.StackReference(newStack);
                    this.currentStack.operations.add(this.nextOperation);
                    var index = this.stacks.indexOf(this.currentStack);
                    this.stacks.insert(((index + 1) | 0), newStack);
                    this.currentStack = newStack;
                    this.nextOperation = new ExpressionStack.RusticExpression.Operations.Set();
                }
            },
            PutOperationToken: function (operation) {
                if (this.nextOperation != null) {
                    if (operation.IsLeftUnary) {
                        this.PutLeftOperationToken(operation);
                        return;
                    } else {
                        throw new System.Exception("Unexpected operator found");
                    }
                }

                operation.priorityOffset = this.priorityOffset;
                if (operation.GetPriorityWithOffset() <= ExpressionStack.RusticExpression.RusticOperation.Priority.Ignored) {
                    this.PutOperationOfEqualOrIgnoredPriority(operation);
                } else {
                    if ((operation.HasRightToLeftPrecedence() && this.currentStack.priority <= operation.GetPriorityWithOffset()) || this.currentStack.priority < operation.GetPriorityWithOffset()) {
                        this.PutOperationOfHigherPriority(operation);
                    } else {
                        if (this.currentStack.priority > operation.GetPriorityWithOffset()) {
                            this.PutOperationOfLowerPriority(operation);
                        } else {
                            this.PutOperationOfEqualOrIgnoredPriority(operation);
                        }
                    }
                }
            },
            PutLeftOperationToken: function (operation) {
                if (this.currentStack.priority === operation.GetPriorityWithOffset()) {
                    this.currentStack.operations.add(operation);
                } else {
                    var newStack = new ExpressionStack.RusticExpression.RusticStack(this.stacks.Count, this.currentStack, operation.GetPriorityWithOffset());
                    newStack.operations.add(operation);
                    var index = this.stacks.indexOf(this.currentStack);
                    this.stacks.insert(((index + 1) | 0), newStack);

                    this.PutCustomValueToken(new ExpressionStack.RusticExpression.Evaluators.StackReference(newStack));
                    this.currentStack = newStack;
                    this.nextOperation = new ExpressionStack.RusticExpression.Operations.Set();
                }
            },
            PutOperationOfHigherPriority: function (operation) {
                this.nextOperation = operation;
                var lastOperationFromStack = this.currentStack.operations.getItem(((this.currentStack.operations.Count - 1) | 0));
                var lastOperationValue = lastOperationFromStack.parameter;
                var newStack = new ExpressionStack.RusticExpression.RusticStack(this.stacks.Count, this.currentStack, operation.GetPriorityWithOffset());
                lastOperationFromStack.parameter = new ExpressionStack.RusticExpression.Evaluators.StackReference(newStack);
                var newSetOperation = new ExpressionStack.RusticExpression.Operations.Set();
                newSetOperation.parameter = lastOperationValue;
                newStack.operations.add(newSetOperation);
                var index = this.stacks.indexOf(this.currentStack);
                this.stacks.insert(((index + 1) | 0), newStack);
                this.currentStack = newStack;
            },
            PutOperationOfLowerPriority: function (operation) {
                this.nextOperation = operation;
                while (this.currentStack.priority > operation.GetPriorityWithOffset()) {
                    this.currentStack = this.currentStack.parent;
                }

                if (this.currentStack.priority < operation.GetPriorityWithOffset()) {
                    this.PutOperationOfHigherPriority(operation);
                }
            },
            PutOperationOfEqualOrIgnoredPriority: function (operation) {
                this.nextOperation = operation;
            },
            FinalizeExpression: function () {
                for (var i = (this.stacks.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    var stack = this.stacks.getItem(i);
                    stack.displayId = i;
                    stack.Prepare();
                }
            },
            SimplifyExpression: function () {
                var $t, $t1, $t2;
                var discard = null;
                $t = Bridge.getEnumerator(this.stacks);
                try {
                    while ($t.moveNext()) {
                        var stack = $t.Current;
                        $t1 = Bridge.getEnumerator(stack.operations);
                        try {
                            while ($t1.moveNext()) {
                                var operation = $t1.Current;
                                var reference = null;
                                var hasRefParam = operation.parameter != null && ((reference = Bridge.as(operation.parameter, ExpressionStack.RusticExpression.Evaluators.StackReference))) != null;
                                var canBeSimplified = hasRefParam && reference.stack.CanBeSimplified;
                                if (canBeSimplified) {
                                    operation.parameter = reference.stack.operations.getItem(0).parameter;
                                    discard = discard || new (System.Collections.Generic.HashSet$1(ExpressionStack.RusticExpression.RusticStack)).ctor();
                                    discard.add(reference.stack);
                                }
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                if (discard != null) {
                    $t2 = Bridge.getEnumerator(discard);
                    try {
                        while ($t2.moveNext()) {
                            var item = $t2.Current;
                            this.stacks.remove(item);
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }
                }

                if (this.stacks.Count > 0 && this.stacks.getItem(0).operations.Count === 1) {
                    var set;
                    if (((set = Bridge.as(this.stacks.getItem(0).operations.getItem(0), ExpressionStack.RusticExpression.Operations.Set))) != null) {
                        this.stacks.getItem(0).operations.clear();
                        var stack1 = Bridge.cast(set.parameter, ExpressionStack.RusticExpression.Evaluators.StackReference).stack;
                        this.stacks.getItem(0).operations.AddRange(stack1.operations);
                        this.stacks.getItem(0).priority = stack1.priority;
                        this.stacks.remove(stack1);
                    }
                }
                this.FinalizeExpression();
            },
            FinalizeAndSimplify: function () {
                this.FinalizeExpression();
                this.SimplifyExpression();
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticOperation.Priority", {
        $kind: "nested enum",
        statics: {
            fields: {
                Ignored: -999999,
                AddSub: 1,
                MulDiv: 2,
                Pow: 3,
                PrefixUnary: 4,
                Parenthesis: 20
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser", {
        statics: {
            methods: {
                StringToInt32: function (value, trimChars) {
                    if (trimChars === void 0) { trimChars = []; }
                    var intValue = System.Convert.toInt32(System.String.trimEnd(value, trimChars));
                    if (System.String.endsWith(value, "%")) {
                        return Bridge.box(intValue / 100.0, System.Single, System.Single.format, System.Single.getHashCode);
                    }
                    return Bridge.box(System.Convert.toInt32(Bridge.box(intValue, System.Int32)), System.Int32);
                },
                StringToFloat: function (value, trimChars) {
                    if (trimChars === void 0) { trimChars = []; }
                    var floatValue = System.Convert.toSingle(((System.String.startsWith(value, ".") ? "0" : "") || "") + (System.String.trimEnd(value, trimChars) || ""));
                    if (System.String.endsWith(value, "%")) {
                        return Bridge.box(floatValue / 100.0, System.Single, System.Single.format, System.Single.getHashCode);
                    }
                    return Bridge.box(floatValue, System.Single, System.Single.format, System.Single.getHashCode);
                },
                StringToDouble: function (value, trimChars) {
                    if (trimChars === void 0) { trimChars = []; }
                    var doubleValue = System.Convert.toSingle(System.String.trimEnd(value, trimChars));
                    if (System.String.endsWith(value, "%")) {
                        return Bridge.box(doubleValue / 100.0, System.Double, System.Double.format, System.Double.getHashCode);
                    }
                    return Bridge.box(doubleValue, System.Double, System.Double.format, System.Double.getHashCode);
                },
                StringToTypeCastOperation: function (parser, capture) {
                    var name = System.String.trim(capture, [40, 41]);
                    if (parser.context.availableTypeCasts != null && parser.context.availableTypeCasts.containsKey(name)) {
                        return new ExpressionStack.RusticExpression.Operations.PrefixUnary.TypeCast(parser.context.availableTypeCasts.getItem(name));
                    } else {
                        throw new System.Exception(System.String.format("Invalid type cast, '{0}' is not available as a type", [name]));
                    }
                },
                StickyMatch: function (regex, input, index) {
                    var match = regex.match(input, index.v);
                    if (match.getIndex() !== index.v) {
                        return System.Text.RegularExpressions.Match.getEmpty();
                    }

                    index.v = (match.getIndex() + match.getLength()) | 0;
                    return match;
                },
                FindSuccededGroupIndex: function (match) {
                    if (match.getSuccess() === false) {
                        return -1;
                    }

                    for (var i = 1; i < match.getGroups().getCount(); i = (i + 1) | 0) {
                        if (match.getGroups().get(i).getSuccess()) {
                            return i;
                        }
                    }

                    return 0;
                }
            }
        },
        fields: {
            OpenGroupPattern: null,
            CloseGroupPattern: null,
            MiddleOperators: null,
            LeftOperators: null,
            ValuePattern: null,
            IgnoredPattern: null,
            initialized: false,
            context: null,
            valueExpr: null,
            leftOpExpr: null,
            midOpExpr: null,
            ignoredExpr: null,
            openGroupExpr: null,
            closeGroupExpr: null,
            unexpectedTokenExpr: null,
            currentState: null
        },
        ctors: {
            init: function () {
                this.OpenGroupPattern = function (_o1) {
                        _o1.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[(]", ExpressionStack.RusticExpression.RusticTokenMode.PriorityOffset, function (p, s) {
                            return Bridge.box(100, System.Int32);
                        }));
                        return _o1;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.CloseGroupPattern = function (_o2) {
                        _o2.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[)]", ExpressionStack.RusticExpression.RusticTokenMode.PriorityOffset, function (p, s) {
                            return Bridge.box(-100, System.Int32);
                        }));
                        return _o2;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.MiddleOperators = function (_o3) {
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[*][*]", new ExpressionStack.RusticExpression.Operations.Pow()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[+]", new ExpressionStack.RusticExpression.Operations.Add()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[-]", new ExpressionStack.RusticExpression.Operations.Sub()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[*]", new ExpressionStack.RusticExpression.Operations.Mul()));
                        _o3.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[/]", new ExpressionStack.RusticExpression.Operations.Div()));
                        return _o3;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.LeftOperators = function (_o4) {
                        _o4.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[+](?![.0-9])", new ExpressionStack.RusticExpression.Operations.PrefixUnary.Positive()));
                        _o4.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[-](?![.0-9])", new ExpressionStack.RusticExpression.Operations.PrefixUnary.Negative()));
                        return _o4;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.ValuePattern = function (_o5) {
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]+[Xx%]?(?![.]\\d|\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToInt32(value, [88, 120, 37]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]+(?:[.][0-9]+)?(?:[Ee][-+]?[0-9]+)?[FfXx%](?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToFloat(value, [70, 102, 88, 120, 37]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]*[.][0-9]+(?:[Ee][-+]?[0-9]+)?[FfXx%](?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToFloat(value, [70, 102, 88, 120, 37]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]+(?:[.][0-9]+)?(?:[Ee][-+]?[0-9]+)?[Dd]?(?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToDouble(value, [68, 100]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[-+]?[0-9]*[.][0-9]+(?:[Ee][-+]?[0-9]+)?[Dd]?(?!\\w)", ExpressionStack.RusticExpression.RusticTokenMode.Literal, function (parser, value) {
                            return ExpressionStack.RusticExpression.RusticParser.StringToDouble(value, [68, 100]);
                        }));
                        _o5.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("[A-Za-z_]\\w*", ExpressionStack.RusticExpression.RusticTokenMode.VariableName, function (parser, value) {
                            return new ExpressionStack.RusticExpression.Evaluators.Variable(parser.context, value);
                        }));
                        return _o5;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.GenericCapture)).ctor());
                this.IgnoredPattern = function (_o6) {
                        _o6.add("\\s+");
                        return _o6;
                    }(new (System.Collections.Generic.List$1(System.String)).ctor());
                this.initialized = false;
                this.unexpectedTokenExpr = new System.Text.RegularExpressions.Regex.ctor("\\s*([-$.\\w]+|[^\\w\\s])");
                this.currentState = new (System.Collections.Generic.Stack$1(ExpressionStack.RusticExpression.RusticParser.ParsingState)).ctor();
            },
            ctor: function (context) {
                this.$initialize();
                this.context = context;
                this.LeftOperators.add(new ExpressionStack.RusticExpression.RusticParser.GenericCapture("\\([A-Za-z_]\\w*\\)", ExpressionStack.RusticExpression.RusticTokenMode.Operation, ExpressionStack.RusticExpression.RusticParser.StringToTypeCastOperation));
            }
        },
        methods: {
            Initialize: function () {
                var options = 0;
                this.valueExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.ValuePattern.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.leftOpExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.LeftOperators.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.midOpExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.MiddleOperators.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.openGroupExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.OpenGroupPattern.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.closeGroupExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.CloseGroupPattern.ConvertAll(System.String, function (v) {
                            return v.pattern;
                        })).join(")|(")]), options);
                this.ignoredExpr = new System.Text.RegularExpressions.Regex.ctor(System.String.format("({0})", [Bridge.toArray(this.IgnoredPattern).join(")|(")]), options);
            },
            GetTokenList: function (expression) {
                return new (Bridge.GeneratorEnumerable$1(ExpressionStack.RusticExpression.RusticToken))(Bridge.fn.bind(this, function (expression) {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        index,
                        result,
                        $async_e;

                    var $enumerator = new (Bridge.GeneratorEnumerator$1(ExpressionStack.RusticExpression.RusticToken))(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        if (this.initialized === false) {
                                                this.Initialize();
                                            }

                                            index = { v : 0 };
                                            expression.trim();
                                            this.currentState.Clear();
                                            this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorOrEnd);

                                            
                                        $step = 1;
                                        continue;
                                    }
                                    case 1: {
                                        if ( this.currentState.Count > 0 ) {
                                                $step = 2;
                                                continue;
                                            } 
                                            $step = 6;
                                            continue;
                                    }
                                    case 2: {
                                        this.TryCaptureIgnoredPattern(expression, index);

                                            result = null;
                                            switch (this.currentState.Pop()) {
                                                case ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorOrEnd: 
                                                    result = this.TryCaptureValueOrLeftOperator(expression, index);
                                                    break;
                                                case ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorExpected: 
                                                    result = this.CaptureValueOrLeftOperator(expression, index);
                                                    break;
                                                case ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd: 
                                                    result = this.TryCaptureMiddleOperator(expression, index);
                                                    break;
                                            }

                                            if (result != null) {
                                                $step = 3;
                                                continue;
                                            } 
                                            $step = 5;
                                            continue;
                                    }
                                    case 3: {
                                        $enumerator.current = result;
                                            $step = 4;
                                            return true;
                                    }
                                    case 4: {
                                        $step = 5;
                                        continue;
                                    }
                                    case 5: {
                                        
                                            $step = 1;
                                            continue;
                                    }
                                    case 6: {
                                        this.TryCaptureIgnoredPattern(expression, index);
                                            if (index.v < expression.length) {
                                                throw new System.Exception(System.String.format("Unexpected sequence of characters: {0}", [expression.substr(index.v)]));
                                            }

                                    }
                                    default: {
                                        return false;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            throw $async_e;
                        }
                    }));
                    return $enumerator;
                }, arguments));
            },
            TryCaptureValueOrLeftOperator: function (expression, index, canEndGroups) {
                if (canEndGroups === void 0) { canEndGroups = true; }
                var match;

                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.leftOpExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorExpected);
                    return this.LeftOperators.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.openGroupExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorOrEnd);
                    return this.OpenGroupPattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.valueExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd);
                    return this.ValuePattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                if (canEndGroups && ((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.closeGroupExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd);
                    return this.CloseGroupPattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                return null;
            },
            CaptureValueOrLeftOperator: function (expression, index) {
                var result = this.TryCaptureValueOrLeftOperator(expression, index, false);
                if (result == null) {
                    throw new System.Exception(System.String.concat("Unexpected token: ", this.unexpectedTokenExpr.match(expression, index.v)));
                }
                return result;
            },
            TryCaptureMiddleOperator: function (expression, index, canEndGroups) {
                if (canEndGroups === void 0) { canEndGroups = true; }
                var match;
                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.midOpExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorExpected);
                    return this.MiddleOperators.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                if (canEndGroups && ((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.closeGroupExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.MiddleOperatorOrEnd);
                    return this.CloseGroupPattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                return null;
            },
            TryCaptureIgnoredPattern: function (expression, index) {
                ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.ignoredExpr, expression, index);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser.GenericCapture", {
        $kind: "nested class",
        fields: {
            pattern: null,
            value: null,
            mode: 0
        },
        ctors: {
            ctor: function (pattern, mode, value) {
                this.$initialize();
                this.pattern = pattern;
                this.mode = mode;
                this.value = value;
            }
        },
        methods: {
            ToToken: function (parser, captured) {
                var result = this.value(parser, captured);
                var token;
                return ((token = Bridge.as(result, ExpressionStack.RusticExpression.RusticToken))) != null ? token : new ExpressionStack.RusticExpression.RusticToken(this.mode, result);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser.ParsingState", {
        $kind: "nested enum",
        statics: {
            fields: {
                /**
                 * The expression expects a value or may be empty, like in ( )
                 <p>Next state:<br />
                   - On value found: {@link }.<br />
                   - On left operator found: {@link }<br /></p>
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 0
                 * @type number
                 */
                ValueOrLeftOperatorOrEnd: 0,
                /**
                 * The expression expects a value, like in A + B + ?
                 <p>Next state:<br />
                   - On value found: {@link }.<br />
                   - On left operator found: {@link }<br /></p>
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 1
                 * @type number
                 */
                ValueOrLeftOperatorExpected: 1,
                /**
                 * The expression expects a middle operator or the end of the expression, like in A + B ?
                 <p>Next state:<br />
                   - On operator found: {@link }.<br /></p>
                 *
                 * @static
                 * @public
                 * @memberof number
                 * @constant
                 * @default 2
                 * @type number
                 */
                MiddleOperatorOrEnd: 2
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticStack", {
        fields: {
            displayId: 0,
            priority: 0,
            parent: null,
            operations: null,
            executed: false,
            result: null,
            resultType: null
        },
        props: {
            CanBeSimplified: {
                get: function () {
                    return this.operations.Count === 1 && Bridge.is(this.operations.getItem(0), ExpressionStack.RusticExpression.Operations.Set) && this.operations.getItem(0).parameter != null;
                }
            },
            ResultValue: {
                get: function () {
                    if (this.executed) {
                        return this.result;
                    } else {
                        throw new System.Exception("This stack did not execute yet");
                    }
                }
            }
        },
        ctors: {
            init: function () {
                this.operations = new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticOperation)).ctor();
                this.executed = false;
            },
            ctor: function (id, parent, priority) {
                this.$initialize();
                this.displayId = id;
                this.parent = parent;
                this.priority = priority;
            }
        },
        methods: {
            Prepare: function () {
                var $t;
                var moveLeftUnaryOperations = new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticOperation)).ctor();
                $t = Bridge.getEnumerator(this.operations);
                try {
                    while ($t.moveNext()) {
                        var operation = $t.Current;
                        if (operation.IsLeftUnary) {
                            moveLeftUnaryOperations.add(operation);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                for (var i = (moveLeftUnaryOperations.Count - 1) | 0; i >= 0; i = (i - 1) | 0) {
                    var operation1 = moveLeftUnaryOperations.getItem(i);
                    this.operations.remove(operation1);
                    this.operations.add(operation1);
                }

                this.PreviewResultType();
            },
            Execute: function () {
                this.result = Bridge.box(0.0, System.Single, System.Single.format, System.Single.getHashCode);
                for (var i = 0; i < this.operations.Count; i = (i + 1) | 0) {
                    this.result = this.operations.getItem(i).Execute(this.result);
                }
                this.executed = true;
            },
            PreviewResultType: function () {
                if (this.resultType == null) {
                    for (var i = 0; i < this.operations.Count; i = (i + 1) | 0) {
                        this.resultType = this.operations.getItem(i).PreviewResultType(this.resultType);
                    }
                }

                return this.resultType;
            },
            ToExpressionString: function () {
                var str = " (";
                var first = this.operations.FindIndex$2(function (op) {
                    return op.IsLeftUnary;
                });

                if (first >= 0) {
                    for (var i = first; i < this.operations.Count; i = (i + 1) | 0) {
                        str = (str || "") + ((this.operations.getItem(i).ToExpressionString()) || "");
                    }
                }

                for (var i1 = 0; i1 < this.operations.Count; i1 = (i1 + 1) | 0) {
                    if (this.operations.getItem(i1).IsLeftUnary) {
                        break;
                    }
                    str = (str || "") + ((this.operations.getItem(i1).ToExpressionString()) || "");
                }

                str = (str || "") + " )";
                return str;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticToken", {
        fields: {
            mode: 0,
            value: null
        },
        ctors: {
            ctor: function (mode, value) {
                this.$initialize();
                this.mode = mode;
                this.value = value;
            }
        },
        methods: {
            toString: function () {
                return System.String.format("RusticToken({0}, \"{1}\")", Bridge.box(this.mode, ExpressionStack.RusticExpression.RusticTokenMode, System.Enum.toStringFn(ExpressionStack.RusticExpression.RusticTokenMode)), this.value);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticTokenMode", {
        $kind: "enum",
        statics: {
            fields: {
                Ignored: 0,
                Literal: 1,
                VariableName: 2,
                Operation: 3,
                PriorityOffset: 4
            }
        }
    });

    Bridge.define("LivePreview.App", {
        main: function Main () {
            LivePreview.App.ResultBox = document.getElementById("expr-resultbox");
            LivePreview.App.InputExpression = document.getElementById("tExpression");

            LivePreview.App.InputExpression.oninput = LivePreview.App.OnInputExpression;

            LivePreview.App.OnInputExpression(null);


        },
        statics: {
            fields: {
                ResultBox: null,
                InputExpression: null
            },
            methods: {
                OnInputExpression: function (ev) {
                    var $t;
                    try {
                        var context = ($t = new ExpressionStack.RusticExpression.RusticContext(), $t.availableTypeCasts = function (_o1) {
                                _o1.add("int", System.Int32);
                                _o1.add("float", System.Single);
                                _o1.add("double", System.Double);
                                return _o1;
                            }(new (System.Collections.Generic.Dictionary$2(System.String,System.Type)).ctor()), $t.variables = function (_o2) {
                                _o2.add("PI", Bridge.box(Math.PI, System.Double, System.Double.format, System.Double.getHashCode));
                                return _o2;
                            }(new (System.Collections.Generic.Dictionary$2(System.String,System.Object)).ctor()), $t);
                        var expr = new ExpressionStack.RusticExpression.RusticExpr.$ctor3(LivePreview.App.InputExpression.value, context);
                        expr.Execute();
                        LivePreview.App.ResultBox.innerHTML = LivePreview.BridgePrintHtml.PrintToHtml(expr);
                    } catch (e) {
                        e = System.Exception.create(e);
                        LivePreview.App.ResultBox.innerHTML = System.String.format("Fix your formula: {0}", [e.Message]);
                    }
                }
            }
        }
    });

    Bridge.define("LivePreview.BridgePrintHtml", {
        statics: {
            methods: {
                PrintToHtml: function (expr) {
                    var $t, $t1, $t2, $t3, $t4, $t5;
                    var html = System.String.format("<div class=\"expr-result\">Result: {0}</div>", [expr.stacks.getItem(0).ResultValue]);
                    html = (html || "") + "<table width=100%>";

                    html = (html || "") + "<thead>";
                    html = (html || "") + "<tr>";
                    html = (html || "") + "<th>Stack Register</th>";
                    html = (html || "") + "<th width=50%>Operation</th>";
                    html = (html || "") + "<th width=20%>Result</th>";
                    html = (html || "") + "<th>Type</th>";
                    html = (html || "") + "</tr>";
                    html = (html || "") + "</thead>";

                    html = (html || "") + "<tbody>";

                    $t = Bridge.getEnumerator(expr.stacks);
                    try {
                        while ($t.moveNext()) {
                            var stack = $t.Current;
                            var isFirst = true;
                            var prevType = null;
                            var resultValue = null;
                            $t1 = Bridge.getEnumerator(stack.operations);
                            try {
                                while ($t1.moveNext()) {
                                    var operation = $t1.Current;
                                    html = (html || "") + "<tr>";
                                    if (isFirst) {
                                        html = (html || "") + ((System.String.format("<td rowspan='{0}'>R{1}</td>", Bridge.box(((stack.operations.Count + 1) | 0), System.Int32), Bridge.box(stack.displayId, System.Int32))) || "");
                                    }

                                    var opResultType = operation.PreviewResultType(prevType);
                                    resultValue = operation.Execute(resultValue);

                                    html = (html || "") + ((System.String.format("<td>{0}{1}</td>", Bridge.Reflection.getTypeName(Bridge.getType(operation)), (operation.parameter != null ? System.String.concat(" ", operation.parameter) : ""))) || "");

                                    html = (html || "") + ((System.String.format("<td>R{0}: {1}</td>", Bridge.box(stack.displayId, System.Int32), resultValue)) || "");

                                    html = (html || "") + ((System.String.format("<td style='white-space: nowrap'>{0}({1}, {2}): {3}</td>", Bridge.Reflection.getTypeName(Bridge.getType(operation)), ($t2 = (prevType != null ? Bridge.Reflection.getTypeName(prevType) : null), $t2 != null ? $t2 : "null"), (operation.parameter != null ? " " + (Bridge.Reflection.getTypeName(operation.parameterType) || "") : "null"), Bridge.Reflection.getTypeName(opResultType))) || "");

                                    html = (html || "") + "</tr>";
                                    isFirst = false;
                                    prevType = opResultType;
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }

                            html = (html || "") + ((System.String.format("<tr style='font-weight:bold'><td>Return</td><td>R{0}: {1}</td><td>{2}</td></tr>", Bridge.box(stack.displayId, System.Int32), ($t3 = stack.ResultValue, $t3 != null ? $t3 : "null"), ($t4 = (($t5 = stack.ResultValue) != null ? Bridge.Reflection.getTypeName(Bridge.getType($t5)) : null), $t4 != null ? $t4 : "null"))) || "");

                            html = (html || "") + "</tr>";
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }

                    html = (html || "") + "</tbody>";
                    html = (html || "") + "</table>";
                    return html;
                }
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Evaluators.Literal", {
        inherits: [ExpressionStack.RusticExpression.RusticValueEvaluator],
        fields: {
            value: null
        },
        ctors: {
            ctor: function (value) {
                this.$initialize();
                ExpressionStack.RusticExpression.RusticValueEvaluator.ctor.call(this);
                this.value = value;
            }
        },
        methods: {
            GetValue$1: function () {
                return this.value;
            },
            GetValueType: function () {
                return Bridge.getType(this.value);
            },
            toString: function () {
                return System.String.format("{0}", [this.value]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Evaluators.StackReference", {
        inherits: [ExpressionStack.RusticExpression.RusticValueEvaluator],
        fields: {
            stack: null
        },
        ctors: {
            ctor: function (stack) {
                this.$initialize();
                ExpressionStack.RusticExpression.RusticValueEvaluator.ctor.call(this);
                this.stack = stack;
            }
        },
        methods: {
            GetValue$1: function () {
                return this.stack.ResultValue;
            },
            GetValueType: function () {
                return this.stack.PreviewResultType();
            },
            toString: function () {
                return System.String.format("R{0}", [Bridge.box(this.stack.displayId, System.Int32)]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Evaluators.Variable", {
        inherits: [ExpressionStack.RusticExpression.RusticValueEvaluator],
        fields: {
            context: null,
            variableName: null,
            variableType: null
        },
        ctors: {
            ctor: function (context, variableId) {
                var $t;
                this.$initialize();
                ExpressionStack.RusticExpression.RusticValueEvaluator.ctor.call(this);
                this.context = context;
                this.variableName = variableId;
                this.variableType = ($t = this.GetValue$1()) != null ? Bridge.getType($t) : null;
            }
        },
        methods: {
            GetValue$1: function () {
                var value = { v : null };
                if (System.Nullable.eq((this.context != null ? this.context.variables.tryGetValue(this.variableName, value) : null), true)) {
                    return value.v;
                } else {
                    return null;
                }
            },
            GetValueType: function () {
                return this.variableType;
            },
            toString: function () {
                return this.variableName;
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Add", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.AddSub;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Add.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Add.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Add.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" + {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Div", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.MulDiv;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Div.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Div.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Div.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" / {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Mul", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.MulDiv;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Mul.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Mul.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Mul.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" * {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Pow", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        methods: {
            Execute: function (stored) {
                return Bridge.box(Math.pow(System.Convert.toDouble(stored), System.Convert.toDouble(this.parameterValue)), System.Double, System.Double.format, System.Double.getHashCode);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.Pow;
            },
            PreviewResultType: function (incomingStoredType) {
                return System.Double;
            },
            HasRightToLeftPrecedence: function () {
                return true;
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" ** ({0})", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.PrefixUnary.Negative", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, null);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.PrefixUnary;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Negative.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Negative.getItem(System.Single);
                    return System.Single;
                } else {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Negative.getItem(System.Int32);
                    return System.Int32;
                }
            },
            ToExpressionString: function () {
                return System.String.format(" -", null);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.PrefixUnary.Positive", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, null);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.PrefixUnary;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Positive.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Positive.getItem(System.Single);
                    return System.Single;
                } else {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Positive.getItem(System.Int32);
                    return System.Int32;
                }
            },
            ToExpressionString: function () {
                return System.String.format(" +", null);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.PrefixUnary.TypeCast", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            referenceType: null
        },
        ctors: {
            ctor: function (referenceType) {
                this.$initialize();
                ExpressionStack.RusticExpression.RusticOperation.ctor.call(this);
                this.referenceType = referenceType;
            }
        },
        methods: {
            Execute: function (stored) {
                return System.Convert.changeType(stored, this.referenceType);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.PrefixUnary;
            },
            PreviewResultType: function (incomingStoredType) {
                return this.referenceType;
            },
            ToExpressionString: function () {
                return System.String.format(" ({0})", [Bridge.Reflection.getTypeName(this.referenceType)]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Set", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        methods: {
            Execute: function (stored) {
                return this.parameterValue;
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.Ignored;
            },
            PreviewResultType: function (incomingStoredType) {
                return this.parameterType;
            },
            HasRightToLeftPrecedence: function () {
                return true;
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.Operations.Sub", {
        inherits: [ExpressionStack.RusticExpression.RusticOperation],
        fields: {
            func: null
        },
        methods: {
            Execute: function (stored) {
                return this.func(stored, this.parameterValue);
            },
            GetPriority: function () {
                return ExpressionStack.RusticExpression.RusticOperation.Priority.AddSub;
            },
            PreviewResultType: function (incomingStoredType) {
                if (Bridge.referenceEquals(incomingStoredType, System.Double) || Bridge.referenceEquals(this.parameterType, System.Double)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Sub.getItem(System.Double);
                    return System.Double;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Single) || Bridge.referenceEquals(this.parameterType, System.Single)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Sub.getItem(System.Single);
                    return System.Single;
                } else if (Bridge.referenceEquals(incomingStoredType, System.Int32) && Bridge.referenceEquals(this.parameterType, System.Int32)) {
                    this.func = ExpressionStack.RusticExpression.Operations.Providers.CommonMath.Sub.getItem(System.Int32);
                    return System.Int32;
                } else {
                    throw new System.NotImplementedException.$ctor1("Could not infer the resulting type");
                }
            },
            ToExpressionString: function () {
                var $t;
                return System.String.format(" - {0}", [($t = this.parameter) != null ? Bridge.toString($t) : null]);
            }
        }
    });

    Bridge.define("ExpressionStack.RusticExpression.RusticParser.OperationCapture", {
        inherits: [ExpressionStack.RusticExpression.RusticParser.GenericCapture],
        $kind: "nested class",
        ctors: {
            ctor: function (pattern, operation) {
                this.$initialize();
                ExpressionStack.RusticExpression.RusticParser.GenericCapture.ctor.call(this, pattern, ExpressionStack.RusticExpression.RusticTokenMode.Operation, function (p, c) {
                    return Bridge.createInstance(Bridge.getType(operation));
                });
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJMaXZlUHJldmlldy5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiUnVzdGljRXhwcmVzc2lvbi9EZWJ1Z0V4dGVuc2lvbi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljVmFsdWVFdmFsdWF0b3IuY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY09wZXJhdGlvbi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9Qcm92aWRlcnMvQ29tbW9uTWF0aC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljQ29udGV4dC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljRXhwci5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljRXhwckJ1aWxkZXIuY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY1BhcnNlci5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljU3RhY2suY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY1Rva2VuLmNzIiwiQXBwLmNzIiwiQnJpZGdlUHJpbnRIdG1sLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9FdmFsdWF0b3JzL0xpdGVyYWwuY3MiLCJSdXN0aWNFeHByZXNzaW9uL0V2YWx1YXRvcnMvU3RhY2tSZWZlcmVuY2UuY3MiLCJSdXN0aWNFeHByZXNzaW9uL0V2YWx1YXRvcnMvVmFyaWFibGUuY3MiLCJSdXN0aWNFeHByZXNzaW9uL09wZXJhdGlvbnMvQWRkLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL0Rpdi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9NdWwuY3MiLCJSdXN0aWNFeHByZXNzaW9uL09wZXJhdGlvbnMvUG93LmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1ByZWZpeFVuYXJ5L05lZ2F0aXZlLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1ByZWZpeFVuYXJ5L1Bvc2l0aXZlLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1ByZWZpeFVuYXJ5L1R5cGVDYXN0LmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1NldC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9TdWIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O3NDQVVzQ0E7O29CQUUxQkEsYUFBMkJBO29CQUMzQkEsS0FBS0EsUUFBUUEsd0JBQWtCQSxRQUFRQTt3QkFHbkNBLHlCQUFrQkEsaUVBQThCQSw2QkFBRUEsMEJBQU9BLDRDQUE0QkEsZUFBT0E7d0JBQzVGQSxJQUFJQSxlQUFPQTs0QkFFUEEseUJBQWtCQTs7NEJBSWxCQSxlQUFnQkE7NEJBQ2hCQSxLQUFLQSxXQUFXQSxJQUFJQSxlQUFPQSxxQkFBcUJBO2dDQUU1Q0EsZ0JBQTRCQSxlQUFPQSxzQkFBY0E7Z0NBQ2pEQSx5QkFBa0JBLCtEQUE0QkEsMERBQXlCQSxDQUFDQSx1QkFBdUJBLFlBQVlBLDJCQUFPQSx1Q0FBcUNBLCtDQUF1Q0EsMERBQXlCQSxPQUFDQSxZQUFVQSxPQUFLQSwwQ0FBY0EsQUFBUUEsb0JBQXRDQSxjQUFzREEsUUFBQ0EsT0FBb0NBLDRCQUEwQkEsT0FBS0EscUNBQWtEQSxBQUFRQSxxQkFBOUhBLGVBQThJQSwwREFBNEJBO2dDQUN2YkEsV0FBV0EsNEJBQTRCQTs7Ozt3QkFJL0NBLElBQUlBLGVBQU9BOzRCQUVQQSx5QkFBa0JBLHNFQUFrQ0EsZUFBT0EsaUNBQStCQSxpQ0FBd0JBLFFBQUNBLE9BQW9DQSxlQUFPQSxtQkFBaUJBLE9BQUtBLHFEQUE4REEsQUFBUUEscUJBQXhJQTs7d0JBRXRIQTs7Ozs7Ozs7O2dDQzVCRUE7Z0JBRWRBLE9BQU9BLFlBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkNLTkEsT0FBT0E7Ozs7OztvQkFNUEEsT0FBT0EsTUFBb0NBLG1CQUFZQSxPQUFLQSxvQkFBNEVBLEFBQU1BOzs7OztvQkE2QjlJQSxPQUFPQSx1QkFBaUJBOzs7Ozs7Z0JBakI1QkEsT0FBT0Es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QU9BLEFBQU9BOzs7O2dCQUsxQkEsT0FBT0E7Ozs7Ozs7Ozs7OzRCQzFCYUE7OztnQkFFWkEscUJBQXFCQTs7OzsrQkFFRkE7Z0JBRTNCQSxPQUFPQSwwQkFBbUJBLFFBQVFBOzs7Z0JBR2xDQSxPQUFPQTs7eUNBQzZCQTtnQkFFcENBLE9BQU9BOzs7Z0JBR1BBLE9BQU9BLGdDQUF1QkE7Ozs7Ozs7OytCQ2pCSEE7Z0JBRTNCQSxPQUFPQTs7O2dCQUdQQSxPQUFPQTs7eUNBQzZCQTtnQkFFcENBLE9BQU9BOzs7Z0JBR1BBOzs7O2dCQUdBQSxPQUFPQSw4QkFBcUJBLE1BQW9DQSxtQkFBWUEsT0FBS0Esc0JBQXdFQSxBQUFRQTs7Ozs7Ozs7Ozs7K0JDVHRJQTtnQkFFM0JBLE9BQU9BLFVBQUtBLFFBQVFBOzs7Z0JBR3BCQSxPQUFPQTs7eUNBRW9DQTtnQkFFbkNBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVdBLDJDQUFpQkEsQUFBT0E7b0JBRWhFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7dUJBRWJBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVVBLDJDQUFpQkEsQUFBT0E7b0JBRXBFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7dUJBRWJBLElBQUlBLDJDQUFzQkEsQUFBT0EsaUJBQVFBLDJDQUFpQkEsQUFBT0E7b0JBRWxFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7O29CQUdkQSxNQUFNQSxJQUFJQTs7Ozs7Z0JBSXRCQSxPQUFPQSxnQ0FBdUJBLE1BQW9DQSxtQkFBWUEsT0FBS0Esc0JBQXdFQSxBQUFRQTs7Ozs7Ozs7OzRCaEI2TG5JQSxTQUFnQkE7OzZGQUFpQ0EsU0FBU0EsNERBQTJCQSxVQUFDQSxHQUFFQTsyQkFBSUEsc0JBQXlCQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgc3RhdGljIGNsYXNzIERlYnVnRXh0ZW5zaW9uXHJcbiAgICB7XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyB2b2lkIFByaW50RGVidWcodGhpcyBSdXN0aWNFeHByIGV4cHJlc3Npb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFJ1c3RpY1N0YWNrPiBzdGFja3MgPSBleHByZXNzaW9uLnN0YWNrcztcclxuICAgICAgICAgICAgZm9yIChpbnQgciA9IHN0YWNrcy5Db3VudCAtIDE7IHIgPj0gMDsgci0tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBcInI5OVtwPTk5XTogIFwiXHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiUnswfSBbUD17MX1dOlwiLHIsc3RhY2tzW3JdLnByaW9yaXR5KS5QYWRSaWdodCgzMCkgKyBzdGFja3Nbcl0uVG9FeHByZXNzaW9uU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrc1tyXS5vcGVyYXRpb25zLkNvdW50ID09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIk5vIG9wZXJhdGlvbnMgZm91bmQuXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUeXBlIHByZXZUeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IHN0YWNrc1tyXS5vcGVyYXRpb25zLkNvdW50OyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBSdXN0aWNPcGVyYXRpb24gb3BlcmF0aW9uID0gc3RhY2tzW3JdLm9wZXJhdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCIgIHswfSBSWHsxfVwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwob3BlcmF0aW9uLnBhcmFtZXRlciA9PSBudWxsID8gXCJcIiA6IFwiLCBcIiArIG9wZXJhdGlvbi5wYXJhbWV0ZXIpKS5QYWRSaWdodCgzMCkgKyBzdHJpbmcuRm9ybWF0KFwiICAjIHswfSh7MX0sIHsyfSk6IHszfVwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwocHJldlR5cGUhPW51bGw/cHJldlR5cGUuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiLChnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLG9wZXJhdGlvbi5wYXJhbWV0ZXJUeXBlKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8VHlwZT4oXCJrZXkxXCIpLk5hbWU6KHN0cmluZyludWxsKSA/PyBcIm51bGxcIixvcGVyYXRpb24uUHJldmlld1Jlc3VsdFR5cGUocHJldlR5cGUpLk5hbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldlR5cGUgPSBvcGVyYXRpb24uUHJldmlld1Jlc3VsdFR5cGUocHJldlR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2tzW3JdLmV4ZWN1dGVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCIgIFJlc3VsdFZhbHVlIHswfVwiLHN0YWNrc1tyXS5SZXN1bHRWYWx1ZSkuUGFkUmlnaHQoMzApICsgc3RyaW5nLkZvcm1hdChcIiAgIyB7MH1cIiwoZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTJcIixzdGFja3Nbcl0uUmVzdWx0VmFsdWUpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxvYmplY3Q+KFwia2V5MlwiKS5HZXRUeXBlKCkuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxue1xuICAgIGFic3RyYWN0IGNsYXNzIFJ1c3RpY1ZhbHVlRXZhbHVhdG9yXG4gICAge1xuICAgICAgICBhYnN0cmFjdCBwdWJsaWMgb2JqZWN0IEdldFZhbHVlKCk7XG4gICAgICAgIGFic3RyYWN0IHB1YmxpYyBUeXBlIEdldFZhbHVlVHlwZSgpO1xucHVibGljIFQgR2V0VmFsdWU8VD4oKVxyXG57XHJcbiAgICByZXR1cm4gKFQpR2V0VmFsdWUoKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgYWJzdHJhY3QgY2xhc3MgUnVzdGljT3BlcmF0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFJ1c3RpY1ZhbHVlRXZhbHVhdG9yIHBhcmFtZXRlciB7IGdldDsgc2V0OyB9XHJcbnB1YmxpYyBvYmplY3QgcGFyYW1ldGVyVmFsdWVcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtZXRlci5HZXRWYWx1ZSgpO1xyXG4gICAgfVxyXG59cHVibGljIFR5cGUgcGFyYW1ldGVyVHlwZVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLkdldFZhbHVlVHlwZSgpOihUeXBlKW51bGw7XHJcbiAgICB9XHJcbn0gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBpbnQgcHJpb3JpdHlPZmZzZXQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYWJzdHJhY3QgcHVibGljIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGFic3RyYWN0IHB1YmxpYyBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKTtcclxuICAgICAgICBcclxuICAgICAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKTtcclxucHVibGljIGludCBHZXRQcmlvcml0eVdpdGhPZmZzZXQoKVxyXG57XHJcbiAgICByZXR1cm4gKGludClHZXRQcmlvcml0eSgpICsgcHJpb3JpdHlPZmZzZXQ7XHJcbn1wdWJsaWMgYm9vbCBIYXNJbmNyZWFzZWRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiAocGFyYW1ldGVyICE9IG51bGwpICYmIChwYXJhbWV0ZXIgaXMgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZSk7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCJ7MH17MX1cIixHZXRUeXBlKCkuTmFtZSwocGFyYW1ldGVyICE9IG51bGwgPyBwYXJhbWV0ZXIuR2V0VHlwZSgpLk5hbWUgOiBcIlwiKSk7XHJcbn1wdWJsaWMgdmlydHVhbCBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgezB9ezF9XCIsR2V0VHlwZSgpLk5hbWUsKHBhcmFtZXRlciAhPSBudWxsID8gXCIgXCIgKyBwYXJhbWV0ZXJWYWx1ZSA6IFwiXCIpKTtcclxufXB1YmxpYyB2aXJ0dWFsIGJvb2wgSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKClcclxue1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59cHVibGljIHZpcnR1YWwgYm9vbCBJc0xlZnRVbmFyeVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR2V0UHJpb3JpdHkoKSA9PSBQcmlvcml0eS5QcmVmaXhVbmFyeTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgRmlyc3RQcmlvcml0eSA9IDE7IC8vIFRoaXMgaXMgdGhlIHZhbHVlIG9mIHRoZSBsb3dlciBwcmlvcml0eSBvcGVyYXRpb24gKGV4Y2VwdCB0aG9zZSB0aGF0IGRvZXNuJ3QgaGF2ZSBwcmlvcml0eSBhbmQgYXJlIHNldCB0byAtOTk5OTk5IG9yIHNvbWV0aGluZyBsaWtlIHRoYXQpLlxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBQcmlvcml0eVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSWdub3JlZCA9IC05OTk5OTksXHJcbiAgICAgICAgICAgIEFkZFN1YiA9IDEsXHJcbiAgICAgICAgICAgIE11bERpdiA9IDIsXHJcbiAgICAgICAgICAgIFBvdyA9IDMsXHJcbiAgICAgICAgICAgIFByZWZpeFVuYXJ5ID0gNCxcclxuXHJcbiAgICAgICAgICAgIFBhcmVudGhlc2lzID0gMjAsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zLlByb3ZpZGVyc1xyXG57XHJcbiAgICBzdGF0aWMgY2xhc3MgQ29tbW9uTWF0aFxyXG4gICAge1xyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PiBOZWdhdGl2ZSA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+KCksKF9vMSk9PntfbzEuQWRkKHR5cGVvZihmbG9hdCksTmVnYXRpdmVTaW5nbGUpO19vMS5BZGQodHlwZW9mKGRvdWJsZSksTmVnYXRpdmVEb3VibGUpO19vMS5BZGQodHlwZW9mKGludCksTmVnYXRpdmVJbnQzMik7cmV0dXJuIF9vMTt9KTtcclxuc3RhdGljIG9iamVjdCBOZWdhdGl2ZVNpbmdsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiAtQ29udmVydC5Ub1NpbmdsZShhKTtcclxufXN0YXRpYyBvYmplY3QgTmVnYXRpdmVEb3VibGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gLUNvbnZlcnQuVG9Eb3VibGUoYSk7XHJcbn1zdGF0aWMgb2JqZWN0IE5lZ2F0aXZlSW50MzIob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gLUNvbnZlcnQuVG9JbnQzMihhKTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PiBQb3NpdGl2ZSA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+KCksKF9vMik9PntfbzIuQWRkKHR5cGVvZihmbG9hdCksUG9zaXRpdmVTaW5nbGUpO19vMi5BZGQodHlwZW9mKGRvdWJsZSksUG9zaXRpdmVEb3VibGUpO19vMi5BZGQodHlwZW9mKGludCksUG9zaXRpdmVJbnQzMik7cmV0dXJuIF9vMjt9KTtcclxuc3RhdGljIG9iamVjdCBQb3NpdGl2ZVNpbmdsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvU2luZ2xlKGEpO1xyXG59c3RhdGljIG9iamVjdCBQb3NpdGl2ZURvdWJsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvRG91YmxlKGEpO1xyXG59c3RhdGljIG9iamVjdCBQb3NpdGl2ZUludDMyKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9JbnQzMihhKTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PiBBZGQgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PigpLChfbzMpPT57X28zLkFkZCh0eXBlb2YoZmxvYXQpLEFkZFNpbmdsZSk7X28zLkFkZCh0eXBlb2YoZG91YmxlKSxBZGREb3VibGUpO19vMy5BZGQodHlwZW9mKGludCksQWRkSW50MzIpO3JldHVybiBfbzM7fSk7XHJcbnN0YXRpYyBvYmplY3QgQWRkU2luZ2xlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9TaW5nbGUoYSkgKyBDb252ZXJ0LlRvU2luZ2xlKGIpO1xyXG59c3RhdGljIG9iamVjdCBBZGREb3VibGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0RvdWJsZShhKSArIENvbnZlcnQuVG9Eb3VibGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IEFkZEludDMyKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9JbnQzMihhKSArIENvbnZlcnQuVG9JbnQzMihiKTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PiBTdWIgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PigpLChfbzQpPT57X280LkFkZCh0eXBlb2YoZmxvYXQpLFN1YlNpbmdsZSk7X280LkFkZCh0eXBlb2YoZG91YmxlKSxTdWJEb3VibGUpO19vNC5BZGQodHlwZW9mKGludCksU3ViSW50MzIpO3JldHVybiBfbzQ7fSk7XHJcbnN0YXRpYyBvYmplY3QgU3ViU2luZ2xlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9TaW5nbGUoYSkgLSBDb252ZXJ0LlRvU2luZ2xlKGIpO1xyXG59c3RhdGljIG9iamVjdCBTdWJEb3VibGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0RvdWJsZShhKSAtIENvbnZlcnQuVG9Eb3VibGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IFN1YkludDMyKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9JbnQzMihhKSAtIENvbnZlcnQuVG9JbnQzMihiKTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PiBNdWwgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PigpLChfbzUpPT57X281LkFkZCh0eXBlb2YoZmxvYXQpLE11bFNpbmdsZSk7X281LkFkZCh0eXBlb2YoZG91YmxlKSxNdWxEb3VibGUpO19vNS5BZGQodHlwZW9mKGludCksTXVsSW50MzIpO3JldHVybiBfbzU7fSk7XHJcbnN0YXRpYyBvYmplY3QgTXVsU2luZ2xlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9TaW5nbGUoYSkgKiBDb252ZXJ0LlRvU2luZ2xlKGIpO1xyXG59c3RhdGljIG9iamVjdCBNdWxEb3VibGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0RvdWJsZShhKSAqIENvbnZlcnQuVG9Eb3VibGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IE11bEludDMyKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9JbnQzMihhKSAqIENvbnZlcnQuVG9JbnQzMihiKTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PiBEaXYgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PigpLChfbzYpPT57X282LkFkZCh0eXBlb2YoZmxvYXQpLERpdlNpbmdsZSk7X282LkFkZCh0eXBlb2YoZG91YmxlKSxEaXZEb3VibGUpO19vNi5BZGQodHlwZW9mKGludCksRGl2SW50MzIpO3JldHVybiBfbzY7fSk7XHJcbnN0YXRpYyBvYmplY3QgRGl2U2luZ2xlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9TaW5nbGUoYSkgLyBDb252ZXJ0LlRvU2luZ2xlKGIpO1xyXG59c3RhdGljIG9iamVjdCBEaXZEb3VibGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0RvdWJsZShhKSAvIENvbnZlcnQuVG9Eb3VibGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IERpdkludDMyKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9JbnQzMihhKSAvIENvbnZlcnQuVG9JbnQzMihiKTtcclxufXN0YXRpYyBwdWJsaWMgb2JqZWN0IEludERpdihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoYSkgLyBDb252ZXJ0LlRvSW50MzIoYik7XHJcbn1cclxuICAgICAgICBzdGF0aWMgcHVibGljIERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4gTW9kID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4oKSwoX283KT0+e19vNy5BZGQodHlwZW9mKGZsb2F0KSxNb2RTaW5nbGUpO19vNy5BZGQodHlwZW9mKGRvdWJsZSksTW9kRG91YmxlKTtfbzcuQWRkKHR5cGVvZihpbnQpLE1vZEludDMyKTtyZXR1cm4gX283O30pO1xyXG5zdGF0aWMgb2JqZWN0IE1vZFNpbmdsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvU2luZ2xlKGEpICUgQ29udmVydC5Ub1NpbmdsZShiKTtcclxufXN0YXRpYyBvYmplY3QgTW9kRG91YmxlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9Eb3VibGUoYSkgJSBDb252ZXJ0LlRvRG91YmxlKGIpO1xyXG59c3RhdGljIG9iamVjdCBNb2RJbnQzMihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoYSkgJSBDb252ZXJ0LlRvSW50MzIoYik7XHJcbn0gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgY2xhc3MgUnVzdGljQ29udGV4dFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNFeHByIGV4cHJlc3Npb24geyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbnB1YmxpYyBJUmVhZE9ubHlMaXN0PFJ1c3RpY1N0YWNrPiBzdGFja1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbi5zdGFja3M7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiB2YXJpYWJsZXMgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgVHlwZT4gYXZhaWxhYmxlVHlwZUNhc3RzIHsgZ2V0OyBzZXQ7IH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcblxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uXG57XG4gICAgY2xhc3MgUnVzdGljRXhwclxuICAgIHtcbiAgICAgICAgc3RhdGljIGJvb2wgUHJlZmVyU2ltcGxpZmllZEV4cHJlc3Npb24gPSBmYWxzZTtcbnN0YXRpYyBwdWJsaWMgaW50IEdldFZhcmlhYmxlSUQoc3RyaW5nIG5hbWUpXHJcbntcclxuICAgIHJldHVybiBuYW1lLkdldEhhc2hDb2RlKCk7XHJcbn1cbiAgICAgICAgcHVibGljIHJlYWRvbmx5IExpc3Q8UnVzdGljU3RhY2s+IHN0YWNrcyA9IG5ldyBMaXN0PFJ1c3RpY1N0YWNrPigpO1xuXG4gICAgICAgIHByaXZhdGUgUnVzdGljQ29udGV4dCBjb250ZXh0O1xucHVibGljIFJ1c3RpY0V4cHIoKVxyXG57XHJcbiAgICBSZXNldEV4cHJlc3Npb24oKTtcclxufXB1YmxpYyBSdXN0aWNFeHByKFJ1c3RpY0NvbnRleHQgY29udGV4dCk6IHRoaXMoKVxyXG57XHJcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG59cHVibGljIFJ1c3RpY0V4cHIoc3RyaW5nIGV4cHJlc3Npb24pOiB0aGlzKClcclxue1xyXG4gICAgU2V0RXhwcmVzc2lvbihleHByZXNzaW9uKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNFeHByKHN0cmluZyBleHByZXNzaW9uLCBSdXN0aWNDb250ZXh0IGNvbnRleHQpIDogdGhpcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgICAgICBTZXRFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xyXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBSZXNldEV4cHJlc3Npb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RhY2tzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQgPSBuZXcgUnVzdGljQ29udGV4dCgpO1xyXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRFeHByZXNzaW9uKHN0cmluZyBleHByZXNzaW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKFByZWZlclNpbXBsaWZpZWRFeHByZXNzaW9uKVxyXG4gICAgICAgICAgICAgICAgbmV3IFJ1c3RpY0V4cHJCdWlsZGVyKHRoaXMsIGNvbnRleHQsIGV4cHJlc3Npb24pLkZpbmFsaXplQW5kU2ltcGxpZnkoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgbmV3IFJ1c3RpY0V4cHJCdWlsZGVyKHRoaXMsIGNvbnRleHQsIGV4cHJlc3Npb24pLkZpbmFsaXplRXhwcmVzc2lvbigpO1xyXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb2JqZWN0IEV4ZWN1dGUoKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKGludCByID0gc3RhY2tzLkNvdW50IC0gMTsgciA+PSAwOyByLS0pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhY2tzW3JdLkV4ZWN1dGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHN0YWNrc1swXS5SZXN1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uXHJcbntcclxuICAgIGNsYXNzIFJ1c3RpY0V4cHJCdWlsZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJvdGVjdGVkIFJ1c3RpY0V4cHIgZXhwcmVzc2lvbjtcclxuICAgICAgICBwcm90ZWN0ZWQgUnVzdGljQ29udGV4dCBjb250ZXh0O1xyXG4gICAgICAgIHByb3RlY3RlZCBSdXN0aWNPcGVyYXRpb24gbmV4dE9wZXJhdGlvbjtcclxuICAgICAgICBwcm90ZWN0ZWQgUnVzdGljU3RhY2sgY3VycmVudFN0YWNrO1xyXG4gICAgICAgIHByb3RlY3RlZCBpbnQgcHJpb3JpdHlPZmZzZXQ7XHJcbnByb3RlY3RlZCBMaXN0PFJ1c3RpY1N0YWNrPiBzdGFja3Ncclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb24hPW51bGw/ZXhwcmVzc2lvbi5zdGFja3M6KExpc3Q8UnVzdGljU3RhY2s+KW51bGw7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwcm90ZWN0ZWQgUnVzdGljRXhwckJ1aWxkZXIoKSA6IHRoaXMobnVsbCwgbnVsbCkgeyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNFeHByQnVpbGRlcihSdXN0aWNFeHByIGV4cHJlc3Npb24sIFJ1c3RpY0NvbnRleHQgY29udGV4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICgoZXhwcmVzc2lvbiE9bnVsbD9leHByZXNzaW9uLnN0YWNrcy5Db3VudDooaW50PyludWxsKSA+IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiUnVzdGljRXhwciBpbnN0YW5jZSB3YXMgYWxyZWFkeSBidWlsdCBhbmQgc2hvdWxkIG5vdCBiZSBidWlsdCBhZ2Fpbi4gRGlkIHlvdSBpbnRlbmQgdG8gUmVzZXRFeHByZXNzaW9uP1wiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBuZXcgT3BlcmF0aW9ucy5TZXQoKTtcclxuICAgICAgICAgICAgcHJpb3JpdHlPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHN0YWNrcykhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pmdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxMaXN0PFJ1c3RpY1N0YWNrPj4oXCJrZXkxXCIpLkFkZChuZXcgUnVzdGljU3RhY2soMCwgbnVsbCwgMSkpKTpudWxsO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhY2sgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MlwiLHN0YWNrcykhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPExpc3Q8UnVzdGljU3RhY2s+PihcImtleTJcIilbMF06KFJ1c3RpY1N0YWNrKW51bGw7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgUnVzdGljRXhwckJ1aWxkZXIoUnVzdGljRXhwciBleHByZXNzaW9uLCBSdXN0aWNDb250ZXh0IGNvbnRleHQsIHN0cmluZyBleHByZXNzaW9uTGluZSk6IHRoaXMoZXhwcmVzc2lvbiwgY29udGV4dClcclxue1xyXG4gICAgUGFyc2VBbmRQdXRUb2tlbnMoZXhwcmVzc2lvbkxpbmUpO1xyXG59cHVibGljIFJ1c3RpY0V4cHJCdWlsZGVyKFJ1c3RpY0V4cHIgZXhwcmVzc2lvbiwgUnVzdGljQ29udGV4dCBjb250ZXh0LCBSdXN0aWNUb2tlbltdIHRva2VuTGlzdCk6IHRoaXMoZXhwcmVzc2lvbiwgY29udGV4dClcclxue1xyXG4gICAgUHV0VG9rZW5zKHRva2VuTGlzdCk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgdm9pZCBQYXJzZUFuZFB1dFRva2VucyhzdHJpbmcgZXhwcmVzc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJ1c3RpY1BhcnNlciBwYXJzZXIgPSBuZXcgUnVzdGljUGFyc2VyKGNvbnRleHQpO1xyXG4gICAgICAgICAgICBQdXRUb2tlbnMoRW51bWVyYWJsZS5Ub0FycmF5PFJ1c3RpY1Rva2VuPihwYXJzZXIuR2V0VG9rZW5MaXN0KGV4cHJlc3Npb24pKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBQdXRUb2tlbnMocGFyYW1zIFJ1c3RpY1Rva2VuW10gdG9rZW5zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAodmFyIHRva2VuIGluIHRva2VucylcclxuICAgICAgICAgICAgICAgIFB1dFRva2VuKHRva2VuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFB1dFRva2VuKFJ1c3RpY1Rva2VuIHRva2VuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0b2tlbi5tb2RlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1c3RpY1Rva2VuTW9kZS5MaXRlcmFsOiBQdXRWYWx1ZVRva2VuKHRva2VuLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1c3RpY1Rva2VuTW9kZS5WYXJpYWJsZU5hbWU6IFB1dFZhcmlhYmxlVG9rZW4odG9rZW4udmFsdWUuVG9TdHJpbmcoKSk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBSdXN0aWNUb2tlbk1vZGUuT3BlcmF0aW9uOiBQdXRPcGVyYXRpb25Ub2tlbigoUnVzdGljT3BlcmF0aW9uKXRva2VuLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1c3RpY1Rva2VuTW9kZS5Qcmlvcml0eU9mZnNldDogQ2hhbmdlUHJpb3JpdHkoKGludCl0b2tlbi52YWx1ZSk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBQdXRDdXN0b21WYWx1ZVRva2VuKFJ1c3RpY1ZhbHVlRXZhbHVhdG9yIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG5leHRPcGVyYXRpb24gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkV4cGVjdGluZyBvcGVyYXRvciwgYnV0IHJlY2VpdmVkIG9wZXJhbmQgKHswfSlcIix2YWx1ZS5HZXRUeXBlKCkuTmFtZSkpO1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uLnBhcmFtZXRlciA9IHZhbHVlO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhY2sub3BlcmF0aW9ucy5BZGQobmV4dE9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFB1dFZhbHVlVG9rZW4ob2JqZWN0IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUHV0Q3VzdG9tVmFsdWVUb2tlbihuZXcgRXZhbHVhdG9ycy5MaXRlcmFsKHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0VmFyaWFibGVUb2tlbihzdHJpbmcgdmFyaWFibGVOYW1lKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUHV0Q3VzdG9tVmFsdWVUb2tlbihuZXcgRXZhbHVhdG9ycy5WYXJpYWJsZShjb250ZXh0LCB2YXJpYWJsZU5hbWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBDaGFuZ2VQcmlvcml0eShpbnQgYWRkaXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcmlvcml0eU9mZnNldCArPSBhZGRpdGlvbjtcclxuICAgICAgICAgICAgaWYgKGFkZGl0aW9uID4gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljU3RhY2sgbmV3U3RhY2sgPSBuZXcgUnVzdGljU3RhY2soc3RhY2tzLkNvdW50LCBjdXJyZW50U3RhY2ssIHByaW9yaXR5T2Zmc2V0ICsgUnVzdGljT3BlcmF0aW9uLkZpcnN0UHJpb3JpdHkpO1xyXG4gICAgICAgICAgICAgICAgbmV4dE9wZXJhdGlvbi5wYXJhbWV0ZXIgPSBuZXcgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZShuZXdTdGFjayk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhY2sub3BlcmF0aW9ucy5BZGQobmV4dE9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBpbnQgaW5kZXggPSBzdGFja3MuSW5kZXhPZihjdXJyZW50U3RhY2spO1xyXG4gICAgICAgICAgICAgICAgc3RhY2tzLkluc2VydChpbmRleCArIDEsIG5ld1N0YWNrKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFjayA9IG5ld1N0YWNrO1xyXG4gICAgICAgICAgICAgICAgbmV4dE9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb25zLlNldCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0T3BlcmF0aW9uVG9rZW4oUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChuZXh0T3BlcmF0aW9uICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24uSXNMZWZ0VW5hcnkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHV0TGVmdE9wZXJhdGlvblRva2VuKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJVbmV4cGVjdGVkIG9wZXJhdG9yIGZvdW5kXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcGVyYXRpb24ucHJpb3JpdHlPZmZzZXQgPSBwcmlvcml0eU9mZnNldDtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSA8PSAoaW50KVJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5JZ25vcmVkKVxyXG4gICAgICAgICAgICAgICAgUHV0T3BlcmF0aW9uT2ZFcXVhbE9ySWdub3JlZFByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgKChvcGVyYXRpb24uSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKCkgJiYgY3VycmVudFN0YWNrLnByaW9yaXR5IDw9IG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSkgfHwgY3VycmVudFN0YWNrLnByaW9yaXR5IDwgb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKSAvLyBUTy1ETzogQWx0ZXJhciBwYXJhIGluc2VyaXIgb3BlcmFkb3JlcyBSVExcclxuICAgICAgICAgICAgICAgIFB1dE9wZXJhdGlvbk9mSGlnaGVyUHJpb3JpdHkob3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0YWNrLnByaW9yaXR5ID4gb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKVxyXG4gICAgICAgICAgICAgICAgUHV0T3BlcmF0aW9uT2ZMb3dlclByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIFB1dE9wZXJhdGlvbk9mRXF1YWxPcklnbm9yZWRQcmlvcml0eShvcGVyYXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFB1dExlZnRPcGVyYXRpb25Ub2tlbihSdXN0aWNPcGVyYXRpb24gb3BlcmF0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGFjay5wcmlvcml0eSA9PSBvcGVyYXRpb24uR2V0UHJpb3JpdHlXaXRoT2Zmc2V0KCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGFjay5vcGVyYXRpb25zLkFkZChvcGVyYXRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljU3RhY2sgbmV3U3RhY2sgPSBuZXcgUnVzdGljU3RhY2soc3RhY2tzLkNvdW50LCBjdXJyZW50U3RhY2ssIG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSk7XHJcbiAgICAgICAgICAgICAgICBuZXdTdGFjay5vcGVyYXRpb25zLkFkZChvcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaW50IGluZGV4ID0gc3RhY2tzLkluZGV4T2YoY3VycmVudFN0YWNrKTtcclxuICAgICAgICAgICAgICAgIHN0YWNrcy5JbnNlcnQoaW5kZXggKyAxLCBuZXdTdGFjayk7XHJcblxyXG4gICAgICAgICAgICAgICAgUHV0Q3VzdG9tVmFsdWVUb2tlbihuZXcgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZShuZXdTdGFjaykpO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YWNrID0gbmV3U3RhY2s7XHJcbiAgICAgICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gbmV3IE9wZXJhdGlvbnMuU2V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBQdXRPcGVyYXRpb25PZkhpZ2hlclByaW9yaXR5KFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICBSdXN0aWNPcGVyYXRpb24gbGFzdE9wZXJhdGlvbkZyb21TdGFjayA9IGN1cnJlbnRTdGFjay5vcGVyYXRpb25zW2N1cnJlbnRTdGFjay5vcGVyYXRpb25zLkNvdW50IC0gMV07XHJcbiAgICAgICAgICAgIFJ1c3RpY1ZhbHVlRXZhbHVhdG9yIGxhc3RPcGVyYXRpb25WYWx1ZSA9IGxhc3RPcGVyYXRpb25Gcm9tU3RhY2sucGFyYW1ldGVyO1xyXG4gICAgICAgICAgICBSdXN0aWNTdGFjayBuZXdTdGFjayA9IG5ldyBSdXN0aWNTdGFjayhzdGFja3MuQ291bnQsIGN1cnJlbnRTdGFjaywgb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKTtcclxuICAgICAgICAgICAgbGFzdE9wZXJhdGlvbkZyb21TdGFjay5wYXJhbWV0ZXIgPSBuZXcgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZShuZXdTdGFjayk7XHJcbiAgICAgICAgICAgIFJ1c3RpY09wZXJhdGlvbiBuZXdTZXRPcGVyYXRpb24gPSBuZXcgT3BlcmF0aW9ucy5TZXQoKTtcclxuICAgICAgICAgICAgbmV3U2V0T3BlcmF0aW9uLnBhcmFtZXRlciA9IGxhc3RPcGVyYXRpb25WYWx1ZTtcclxuICAgICAgICAgICAgbmV3U3RhY2sub3BlcmF0aW9ucy5BZGQobmV3U2V0T3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgaW50IGluZGV4ID0gc3RhY2tzLkluZGV4T2YoY3VycmVudFN0YWNrKTtcclxuICAgICAgICAgICAgc3RhY2tzLkluc2VydChpbmRleCArIDEsIG5ld1N0YWNrKTtcclxuICAgICAgICAgICAgY3VycmVudFN0YWNrID0gbmV3U3RhY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0T3BlcmF0aW9uT2ZMb3dlclByaW9yaXR5KFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudFN0YWNrLnByaW9yaXR5ID4gb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YWNrID0gY3VycmVudFN0YWNrLnBhcmVudDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RhY2sucHJpb3JpdHkgPCBvcGVyYXRpb24uR2V0UHJpb3JpdHlXaXRoT2Zmc2V0KCkpXHJcbiAgICAgICAgICAgICAgICBQdXRPcGVyYXRpb25PZkhpZ2hlclByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgUHV0T3BlcmF0aW9uT2ZFcXVhbE9ySWdub3JlZFByaW9yaXR5KFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmluYWxpemVFeHByZXNzaW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAoaW50IGkgPSBzdGFja3MuQ291bnQgLSAxOyBpID49IDA7IGktLSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljU3RhY2sgc3RhY2sgPSBzdGFja3NbaV07XHJcbiAgICAgICAgICAgICAgICBzdGFjay5kaXNwbGF5SWQgPSBpO1xyXG4gICAgICAgICAgICAgICAgc3RhY2suUHJlcGFyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTaW1wbGlmeUV4cHJlc3Npb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSGFzaFNldDxSdXN0aWNTdGFjaz4gZGlzY2FyZCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFJ1c3RpY1N0YWNrIHN0YWNrIGluIHN0YWNrcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbiBpbiBzdGFjay5vcGVyYXRpb25zKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEV2YWx1YXRvcnMuU3RhY2tSZWZlcmVuY2UgcmVmZXJlbmNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBib29sIGhhc1JlZlBhcmFtID0gb3BlcmF0aW9uLnBhcmFtZXRlciAhPSBudWxsICYmIChyZWZlcmVuY2UgPSBvcGVyYXRpb24ucGFyYW1ldGVyIGFzIEV2YWx1YXRvcnMuU3RhY2tSZWZlcmVuY2UpICE9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9vbCBjYW5CZVNpbXBsaWZpZWQgPSBoYXNSZWZQYXJhbSAmJiByZWZlcmVuY2Uuc3RhY2suQ2FuQmVTaW1wbGlmaWVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5CZVNpbXBsaWZpZWQpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24ucGFyYW1ldGVyID0gcmVmZXJlbmNlLnN0YWNrLm9wZXJhdGlvbnNbMF0ucGFyYW1ldGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNjYXJkID0gZGlzY2FyZCA/PyBuZXcgSGFzaFNldDxSdXN0aWNTdGFjaz4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzY2FyZC5BZGQocmVmZXJlbmNlLnN0YWNrKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkaXNjYXJkICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBmb3JlYWNoIChSdXN0aWNTdGFjayBpdGVtIGluIGRpc2NhcmQpXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tzLlJlbW92ZShpdGVtKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNpbXBsaWZ5IHRoZSBzdGFjayByZWdpc3RlciBSMFxyXG4gICAgICAgICAgICBpZiAoc3RhY2tzLkNvdW50ID4gMCAmJiBzdGFja3NbMF0ub3BlcmF0aW9ucy5Db3VudCA9PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSdXN0aWNPcGVyYXRpb24gc2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKChzZXQgPSBzdGFja3NbMF0ub3BlcmF0aW9uc1swXSBhcyBPcGVyYXRpb25zLlNldCkgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFja3NbMF0ub3BlcmF0aW9ucy5DbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIFJ1c3RpY1N0YWNrIHN0YWNrID0gKChFdmFsdWF0b3JzLlN0YWNrUmVmZXJlbmNlKXNldC5wYXJhbWV0ZXIpLnN0YWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrc1swXS5vcGVyYXRpb25zLkFkZFJhbmdlKHN0YWNrLm9wZXJhdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrc1swXS5wcmlvcml0eSA9IHN0YWNrLnByaW9yaXR5O1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrcy5SZW1vdmUoc3RhY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEZpbmFsaXplRXhwcmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRmluYWxpemVBbmRTaW1wbGlmeSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBGaW5hbGl6ZUV4cHJlc3Npb24oKTtcclxuICAgICAgICAgICAgU2ltcGxpZnlFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgcHVibGljIHZvaWQgU2ltcGxpZnlFeHByZXNzaW9uKFJ1c3RpY0V4cHIgZXhwcmVzc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJ1c3RpY0V4cHJCdWlsZGVyIGJ1aWxkZXIgPSBuZXcgUnVzdGljRXhwckJ1aWxkZXIoKTtcclxuICAgICAgICAgICAgYnVpbGRlci5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgYnVpbGRlci5TaW1wbGlmeUV4cHJlc3Npb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLlRleHQuUmVndWxhckV4cHJlc3Npb25zO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uXHJcbntcclxuICAgIGNsYXNzIFJ1c3RpY1BhcnNlclxyXG4gICAge1xyXG4gICAgICAgIC8vIFByaW9yaXR5R3JvdXBcclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxHZW5lcmljQ2FwdHVyZT4gT3Blbkdyb3VwUGF0dGVybiA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PEdlbmVyaWNDYXB0dXJlPigpLChfbzEpPT57X28xLkFkZChuZXcgR2VuZXJpY0NhcHR1cmUoXCJbKF1cIiwgUnVzdGljVG9rZW5Nb2RlLlByaW9yaXR5T2Zmc2V0LCAocCxzKSA9PiArMTAwKSk7cmV0dXJuIF9vMTt9KTtcclxuXHJcbiAgICAgICAgcmVhZG9ubHkgcHVibGljIExpc3Q8R2VuZXJpY0NhcHR1cmU+IENsb3NlR3JvdXBQYXR0ZXJuID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8R2VuZXJpY0NhcHR1cmU+KCksKF9vMik9PntfbzIuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShcIlspXVwiLCBSdXN0aWNUb2tlbk1vZGUuUHJpb3JpdHlPZmZzZXQsIChwLHMpID0+IC0xMDApKTtyZXR1cm4gX28yO30pO1xyXG5cclxuICAgICAgICAvLyBNaWRkbGVPcGVyYXRvcnNcclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxHZW5lcmljQ2FwdHVyZT4gTWlkZGxlT3BlcmF0b3JzID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8R2VuZXJpY0NhcHR1cmU+KCksKF9vMyk9PntfbzMuQWRkKG5ldyBPcGVyYXRpb25DYXB0dXJlKFwiWypdWypdXCIsIG5ldyBPcGVyYXRpb25zLlBvdygpKSk7X28zLkFkZChuZXcgT3BlcmF0aW9uQ2FwdHVyZShcIlsrXVwiLCBuZXcgT3BlcmF0aW9ucy5BZGQoKSkpO19vMy5BZGQobmV3IE9wZXJhdGlvbkNhcHR1cmUoXCJbLV1cIiwgbmV3IE9wZXJhdGlvbnMuU3ViKCkpKTtfbzMuQWRkKG5ldyBPcGVyYXRpb25DYXB0dXJlKFwiWypdXCIsIG5ldyBPcGVyYXRpb25zLk11bCgpKSk7X28zLkFkZChuZXcgT3BlcmF0aW9uQ2FwdHVyZShcIlsvXVwiLCBuZXcgT3BlcmF0aW9ucy5EaXYoKSkpO3JldHVybiBfbzM7fSk7XHJcblxyXG4gICAgICAgIC8vIExlZnRPcGVyYXRvcnNcclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxHZW5lcmljQ2FwdHVyZT4gTGVmdE9wZXJhdG9ycyA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PEdlbmVyaWNDYXB0dXJlPigpLChfbzQpPT57X280LkFkZChuZXcgT3BlcmF0aW9uQ2FwdHVyZShcIlsrXSg/IVsuMC05XSlcIiwgbmV3IE9wZXJhdGlvbnMuUHJlZml4VW5hcnkuUG9zaXRpdmUoKSkpO19vNC5BZGQobmV3IE9wZXJhdGlvbkNhcHR1cmUoXCJbLV0oPyFbLjAtOV0pXCIsIG5ldyBPcGVyYXRpb25zLlByZWZpeFVuYXJ5Lk5lZ2F0aXZlKCkpKTtyZXR1cm4gX280O30pO1xyXG5cclxuICAgICAgICAvLyBWYWx1ZVBhdHRlcm5cclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxHZW5lcmljQ2FwdHVyZT4gVmFsdWVQYXR0ZXJuID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8R2VuZXJpY0NhcHR1cmU+KCksKF9vNSk9PntfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldK1tYeCVdPyg/IVsuXVxcZHxcXHcpXCIsIFJ1c3RpY1Rva2VuTW9kZS5MaXRlcmFsLCAocGFyc2VyLCB2YWx1ZSkgPT4gU3RyaW5nVG9JbnQzMih2YWx1ZSwgJ1gnLCAneCcsICclJykpKTtfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldKyg/OlsuXVswLTldKyk/KD86W0VlXVstK10/WzAtOV0rKT9bRmZYeCVdKD8hXFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvRmxvYXQodmFsdWUsICdGJywgJ2YnLCAnWCcsICd4JywgJyUnKSkpO19vNS5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKEBcIlstK10/WzAtOV0qWy5dWzAtOV0rKD86W0VlXVstK10/WzAtOV0rKT9bRmZYeCVdKD8hXFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvRmxvYXQodmFsdWUsICdGJywgJ2YnLCAnWCcsICd4JywgJyUnKSkpO19vNS5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKEBcIlstK10/WzAtOV0rKD86Wy5dWzAtOV0rKT8oPzpbRWVdWy0rXT9bMC05XSspP1tEZF0/KD8hXFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvRG91YmxlKHZhbHVlLCAnRCcsICdkJykpKTtfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldKlsuXVswLTldKyg/OltFZV1bLStdP1swLTldKyk/W0RkXT8oPyFcXHcpXCIsIFJ1c3RpY1Rva2VuTW9kZS5MaXRlcmFsLCAocGFyc2VyLCB2YWx1ZSkgPT4gU3RyaW5nVG9Eb3VibGUodmFsdWUsICdEJywgJ2QnKSkpO19vNS5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKEBcIltBLVphLXpfXVxcdypcIiwgUnVzdGljVG9rZW5Nb2RlLlZhcmlhYmxlTmFtZSwgKHBhcnNlciwgdmFsdWUpID0+IG5ldyBFdmFsdWF0b3JzLlZhcmlhYmxlKHBhcnNlci5jb250ZXh0LCB2YWx1ZSkpKTtyZXR1cm4gX281O30pO1xyXG5cclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxzdHJpbmc+IElnbm9yZWRQYXR0ZXJuID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8c3RyaW5nPigpLChfbzYpPT57X282LkFkZChAXCJcXHMrXCIpO3JldHVybiBfbzY7fSk7XHJcblxyXG4gICAgICAgIGJvb2wgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICBSdXN0aWNDb250ZXh0IGNvbnRleHQ7XHJcbiAgICAgICAgUmVnZXggdmFsdWVFeHByO1xyXG4gICAgICAgIFJlZ2V4IGxlZnRPcEV4cHI7XHJcbiAgICAgICAgUmVnZXggbWlkT3BFeHByO1xyXG4gICAgICAgIFJlZ2V4IGlnbm9yZWRFeHByO1xyXG4gICAgICAgIFJlZ2V4IG9wZW5Hcm91cEV4cHI7XHJcbiAgICAgICAgUmVnZXggY2xvc2VHcm91cEV4cHI7XHJcbiAgICAgICAgUmVnZXggdW5leHBlY3RlZFRva2VuRXhwciA9IG5ldyBSZWdleChAXCJcXHMqKFstJC5cXHddK3xbXlxcd1xcc10pXCIpO1xyXG5cclxuICAgICAgICBTdGFjazxQYXJzaW5nU3RhdGU+IGN1cnJlbnRTdGF0ZSA9IG5ldyBTdGFjazxQYXJzaW5nU3RhdGU+KCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNQYXJzZXIoUnVzdGljQ29udGV4dCBjb250ZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICAgICAgTGVmdE9wZXJhdG9ycy5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKEBcIlxcKFtBLVphLXpfXVxcdypcXClcIiwgUnVzdGljVG9rZW5Nb2RlLk9wZXJhdGlvbiwgU3RyaW5nVG9UeXBlQ2FzdE9wZXJhdGlvbikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgSW5pdGlhbGl6ZSgpXHJcbiAgICAgICAge1xyXG4jaWYgQlJJREdFX05FVFxyXG4gICAgICAgICAgICBSZWdleE9wdGlvbnMgb3B0aW9ucyA9IFJlZ2V4T3B0aW9ucy5Ob25lO1xyXG4jZWxzZVxyXG4gICAgICAgICAgICBSZWdleE9wdGlvbnMgb3B0aW9ucyA9IFJlZ2V4T3B0aW9ucy5Db21waWxlZDtcclxuI2VuZGlmXHJcbiAgICAgICAgICAgIHZhbHVlRXhwciA9IG5ldyBSZWdleChzdHJpbmcuRm9ybWF0KFwiKHswfSlcIixzdHJpbmcuSm9pbihcIil8KFwiLCBWYWx1ZVBhdHRlcm4uQ29udmVydEFsbDxzdHJpbmc+KChDb252ZXJ0ZXI8UnVzdGljUGFyc2VyLkdlbmVyaWNDYXB0dXJlLHN0cmluZz4pKHYgPT4gdi5wYXR0ZXJuKSkpICksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBsZWZ0T3BFeHByID0gbmV3IFJlZ2V4KHN0cmluZy5Gb3JtYXQoXCIoezB9KVwiLHN0cmluZy5Kb2luKFwiKXwoXCIsIExlZnRPcGVyYXRvcnMuQ29udmVydEFsbDxzdHJpbmc+KChDb252ZXJ0ZXI8UnVzdGljUGFyc2VyLkdlbmVyaWNDYXB0dXJlLHN0cmluZz4pKHYgPT4gdi5wYXR0ZXJuKSkpICksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBtaWRPcEV4cHIgPSBuZXcgUmVnZXgoc3RyaW5nLkZvcm1hdChcIih7MH0pXCIsc3RyaW5nLkpvaW4oXCIpfChcIiwgTWlkZGxlT3BlcmF0b3JzLkNvbnZlcnRBbGw8c3RyaW5nPigoQ29udmVydGVyPFJ1c3RpY1BhcnNlci5HZW5lcmljQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSApLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgb3Blbkdyb3VwRXhwciA9IG5ldyBSZWdleChzdHJpbmcuRm9ybWF0KFwiKHswfSlcIixzdHJpbmcuSm9pbihcIil8KFwiLCBPcGVuR3JvdXBQYXR0ZXJuLkNvbnZlcnRBbGw8c3RyaW5nPigoQ29udmVydGVyPFJ1c3RpY1BhcnNlci5HZW5lcmljQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjbG9zZUdyb3VwRXhwciA9IG5ldyBSZWdleChzdHJpbmcuRm9ybWF0KFwiKHswfSlcIixzdHJpbmcuSm9pbihcIil8KFwiLCBDbG9zZUdyb3VwUGF0dGVybi5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuR2VuZXJpY0NhcHR1cmUsc3RyaW5nPikodiA9PiB2LnBhdHRlcm4pKSkpLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgaWdub3JlZEV4cHIgPSBuZXcgUmVnZXgoc3RyaW5nLkZvcm1hdChcIih7MH0pXCIsc3RyaW5nLkpvaW4oXCIpfChcIiwgSWdub3JlZFBhdHRlcm4pKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8UnVzdGljVG9rZW4+IEdldFRva2VuTGlzdChzdHJpbmcgZXhwcmVzc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbml0aWFsaXplZCA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIEluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGludCBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGV4cHJlc3Npb24uVHJpbSgpO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUuQ2xlYXIoKTtcclxuICAgICAgICAgICAgY3VycmVudFN0YXRlLlB1c2goUGFyc2luZ1N0YXRlLlZhbHVlT3JMZWZ0T3BlcmF0b3JPckVuZCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZShjdXJyZW50U3RhdGUuQ291bnQgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcnlDYXB0dXJlSWdub3JlZFBhdHRlcm4oZXhwcmVzc2lvbiwgcmVmIGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBSdXN0aWNUb2tlbiByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjdXJyZW50U3RhdGUuUG9wKCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kOiByZXN1bHQgPSBUcnlDYXB0dXJlVmFsdWVPckxlZnRPcGVyYXRvcihleHByZXNzaW9uLCByZWYgaW5kZXgpOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFBhcnNpbmdTdGF0ZS5WYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWQ6IHJlc3VsdCA9IENhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKGV4cHJlc3Npb24sIHJlZiBpbmRleCk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgUGFyc2luZ1N0YXRlLk1pZGRsZU9wZXJhdG9yT3JFbmQ6IHJlc3VsdCA9IFRyeUNhcHR1cmVNaWRkbGVPcGVyYXRvcihleHByZXNzaW9uLCByZWYgaW5kZXgpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgVHJ5Q2FwdHVyZUlnbm9yZWRQYXR0ZXJuKGV4cHJlc3Npb24sIHJlZiBpbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IGV4cHJlc3Npb24uTGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiVW5leHBlY3RlZCBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzOiB7MH1cIixleHByZXNzaW9uLlN1YnN0cmluZyhpbmRleCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFJ1c3RpY1Rva2VuIFRyeUNhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKHN0cmluZyBleHByZXNzaW9uLCByZWYgaW50IGluZGV4LCBib29sIGNhbkVuZEdyb3VwcyA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBNYXRjaCBtYXRjaDtcclxuXHJcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSBTdGlja3lNYXRjaChsZWZ0T3BFeHByLCBleHByZXNzaW9uLCByZWYgaW5kZXgpKS5TdWNjZXNzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUuUHVzaChQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvckV4cGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMZWZ0T3BlcmF0b3JzW0ZpbmRTdWNjZWRlZEdyb3VwSW5kZXgobWF0Y2gpIC0gMV0uVG9Ub2tlbih0aGlzLCBtYXRjaC5WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSBTdGlja3lNYXRjaChvcGVuR3JvdXBFeHByLCBleHByZXNzaW9uLCByZWYgaW5kZXgpKS5TdWNjZXNzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUuUHVzaChQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPcGVuR3JvdXBQYXR0ZXJuW0ZpbmRTdWNjZWRlZEdyb3VwSW5kZXgobWF0Y2gpIC0gMV0uVG9Ub2tlbih0aGlzLCBtYXRjaC5WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSBTdGlja3lNYXRjaCh2YWx1ZUV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5NaWRkbGVPcGVyYXRvck9yRW5kKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBWYWx1ZVBhdHRlcm5bRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKHRoaXMsIG1hdGNoLlZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhbkVuZEdyb3VwcyAmJiAobWF0Y2ggPSBTdGlja3lNYXRjaChjbG9zZUdyb3VwRXhwciwgZXhwcmVzc2lvbiwgcmVmIGluZGV4KSkuU3VjY2VzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlLlB1c2goUGFyc2luZ1N0YXRlLk1pZGRsZU9wZXJhdG9yT3JFbmQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIENsb3NlR3JvdXBQYXR0ZXJuW0ZpbmRTdWNjZWRlZEdyb3VwSW5kZXgobWF0Y2gpIC0gMV0uVG9Ub2tlbih0aGlzLCBtYXRjaC5WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBSdXN0aWNUb2tlbiBDYXB0dXJlVmFsdWVPckxlZnRPcGVyYXRvcihzdHJpbmcgZXhwcmVzc2lvbiwgcmVmIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJ1c3RpY1Rva2VuIHJlc3VsdCA9IFRyeUNhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKGV4cHJlc3Npb24sIHJlZiBpbmRleCwgY2FuRW5kR3JvdXBzOiBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJVbmV4cGVjdGVkIHRva2VuOiBcIit1bmV4cGVjdGVkVG9rZW5FeHByLk1hdGNoKGV4cHJlc3Npb24sIGluZGV4KSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBSdXN0aWNUb2tlbiBUcnlDYXB0dXJlTWlkZGxlT3BlcmF0b3Ioc3RyaW5nIGV4cHJlc3Npb24sIHJlZiBpbnQgaW5kZXgsIGJvb2wgY2FuRW5kR3JvdXBzID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIE1hdGNoIG1hdGNoO1xyXG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gU3RpY2t5TWF0Y2gobWlkT3BFeHByLCBleHByZXNzaW9uLCByZWYgaW5kZXgpKS5TdWNjZXNzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUuUHVzaChQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvckV4cGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNaWRkbGVPcGVyYXRvcnNbRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKHRoaXMsIG1hdGNoLlZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhbkVuZEdyb3VwcyAmJiAobWF0Y2ggPSBTdGlja3lNYXRjaChjbG9zZUdyb3VwRXhwciwgZXhwcmVzc2lvbiwgcmVmIGluZGV4KSkuU3VjY2VzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlLlB1c2goUGFyc2luZ1N0YXRlLk1pZGRsZU9wZXJhdG9yT3JFbmQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIENsb3NlR3JvdXBQYXR0ZXJuW0ZpbmRTdWNjZWRlZEdyb3VwSW5kZXgobWF0Y2gpIC0gMV0uVG9Ub2tlbih0aGlzLCBtYXRjaC5WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxudm9pZCBUcnlDYXB0dXJlSWdub3JlZFBhdHRlcm4oc3RyaW5nIGV4cHJlc3Npb24sIHJlZiBpbnQgaW5kZXgpXHJcbntcclxuICAgIFN0aWNreU1hdGNoKGlnbm9yZWRFeHByLCBleHByZXNzaW9uLCByZWYgaW5kZXgpO1xyXG59XHJcbiAgICAgICAgc3RhdGljIG9iamVjdCBTdHJpbmdUb0ludDMyKHN0cmluZyB2YWx1ZSwgcGFyYW1zIGNoYXJbXSB0cmltQ2hhcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgaW50VmFsdWUgPSBDb252ZXJ0LlRvSW50MzIodmFsdWUuVHJpbUVuZCh0cmltQ2hhcnMpKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLkVuZHNXaXRoKFwiJVwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnRWYWx1ZSAvIDEwMGY7XHJcbiAgICAgICAgICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoaW50VmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIG9iamVjdCBTdHJpbmdUb0Zsb2F0KHN0cmluZyB2YWx1ZSwgcGFyYW1zIGNoYXJbXSB0cmltQ2hhcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdCBmbG9hdFZhbHVlID0gQ29udmVydC5Ub1NpbmdsZSgodmFsdWUuU3RhcnRzV2l0aChcIi5cIikgPyBcIjBcIiA6IFwiXCIpICsgdmFsdWUuVHJpbUVuZCh0cmltQ2hhcnMpKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLkVuZHNXaXRoKFwiJVwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBmbG9hdFZhbHVlIC8gMTAwZjtcclxuICAgICAgICAgICAgcmV0dXJuIGZsb2F0VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgb2JqZWN0IFN0cmluZ1RvRG91YmxlKHN0cmluZyB2YWx1ZSwgcGFyYW1zIGNoYXJbXSB0cmltQ2hhcnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkb3VibGUgZG91YmxlVmFsdWUgPSBDb252ZXJ0LlRvU2luZ2xlKHZhbHVlLlRyaW1FbmQodHJpbUNoYXJzKSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5FbmRzV2l0aChcIiVcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZG91YmxlVmFsdWUgLyAxMDBkO1xyXG4gICAgICAgICAgICByZXR1cm4gZG91YmxlVmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgb2JqZWN0IFN0cmluZ1RvVHlwZUNhc3RPcGVyYXRpb24oUnVzdGljUGFyc2VyIHBhcnNlciwgc3RyaW5nIGNhcHR1cmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgbmFtZSA9IGNhcHR1cmUuVHJpbSgnKCcsICcpJyk7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZXIuY29udGV4dC5hdmFpbGFibGVUeXBlQ2FzdHMgIT0gbnVsbCAmJiBwYXJzZXIuY29udGV4dC5hdmFpbGFibGVUeXBlQ2FzdHMuQ29udGFpbnNLZXkobmFtZSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE9wZXJhdGlvbnMuUHJlZml4VW5hcnkuVHlwZUNhc3QocGFyc2VyLmNvbnRleHQuYXZhaWxhYmxlVHlwZUNhc3RzW25hbWVdKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiSW52YWxpZCB0eXBlIGNhc3QsICd7MH0nIGlzIG5vdCBhdmFpbGFibGUgYXMgYSB0eXBlXCIsbmFtZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIE1hdGNoIFN0aWNreU1hdGNoKFJlZ2V4IHJlZ2V4LCBzdHJpbmcgaW5wdXQsIHJlZiBpbnQgaW5kZXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBNYXRjaCBtYXRjaCA9IHJlZ2V4Lk1hdGNoKGlucHV0LCBpbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaC5JbmRleCAhPSBpbmRleClcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRjaC5FbXB0eTtcclxuXHJcbiAgICAgICAgICAgIGluZGV4ID0gbWF0Y2guSW5kZXggKyBtYXRjaC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBpbnQgRmluZFN1Y2NlZGVkR3JvdXBJbmRleChNYXRjaCBtYXRjaClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaC5TdWNjZXNzID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDE7IGkgPCBtYXRjaC5Hcm91cHMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoLkdyb3Vwc1tpXS5TdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBHZW5lcmljQ2FwdHVyZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIHN0cmluZyBwYXR0ZXJuO1xyXG5cclxuICAgICAgICAgICAgcHVibGljIEZ1bmM8UnVzdGljUGFyc2VyLCBzdHJpbmcsb2JqZWN0PiB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHB1YmxpYyBSdXN0aWNUb2tlbk1vZGUgbW9kZTtcclxuXHJcbiAgICAgICAgICAgIHB1YmxpYyBHZW5lcmljQ2FwdHVyZShzdHJpbmcgcGF0dGVybiwgUnVzdGljVG9rZW5Nb2RlIG1vZGUsIEZ1bmM8UnVzdGljUGFyc2VyLCBzdHJpbmcsIG9iamVjdD4gdmFsdWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2aXJ0dWFsIHB1YmxpYyBSdXN0aWNUb2tlbiBUb1Rva2VuKFJ1c3RpY1BhcnNlciBwYXJzZXIsIHN0cmluZyBjYXB0dXJlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IHJlc3VsdCA9IHZhbHVlKHBhcnNlciwgY2FwdHVyZWQpO1xyXG5SdXN0aWNUb2tlbiB0b2tlbjsgICAgICAgICAgICAgICAgcmV0dXJuICh0b2tlbiA9IHJlc3VsdCBhcyBSdXN0aWNUb2tlbikgIT0gbnVsbD8gdG9rZW4gOiBuZXcgUnVzdGljVG9rZW4obW9kZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNsYXNzIE9wZXJhdGlvbkNhcHR1cmU6IEdlbmVyaWNDYXB0dXJlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwdWJsaWMgT3BlcmF0aW9uQ2FwdHVyZShzdHJpbmcgcGF0dGVybiwgUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbik6IGJhc2UocGF0dGVybiwgUnVzdGljVG9rZW5Nb2RlLk9wZXJhdGlvbiwgKHAsYyk9PkFjdGl2YXRvci5DcmVhdGVJbnN0YW5jZShvcGVyYXRpb24uR2V0VHlwZSgpKSlcclxuICAgICAgICAgICAgeyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBQYXJzaW5nU3RhdGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFRoZSBleHByZXNzaW9uIGV4cGVjdHMgYSB2YWx1ZSBvciBtYXkgYmUgZW1wdHksIGxpa2UgaW4gKCApXHJcbiAgICAgICAgICAgIC8vLyBcclxuICAgICAgICAgICAgLy8vIDxwYXJhPlxyXG4gICAgICAgICAgICAvLy8gTmV4dCBzdGF0ZTo8YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiB2YWx1ZSBmb3VuZDogPHNlZSBjcmVmPVwiTWlkZGxlT3BlcmF0b3JPckVuZFwiIC8+LjxiciAvPlxyXG4gICAgICAgICAgICAvLy8gICAtIE9uIGxlZnQgb3BlcmF0b3IgZm91bmQ6IDxzZWUgY3JlZj1cIlZhbHVlT3JMZWZ0T3BlcmF0b3JFeHBlY3RlZFwiLz48YnIgLz5cclxuICAgICAgICAgICAgLy8vIDwvcGFyYT5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kLFxyXG5cclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gVGhlIGV4cHJlc3Npb24gZXhwZWN0cyBhIHZhbHVlLCBsaWtlIGluIEEgKyBCICsgP1xyXG4gICAgICAgICAgICAvLy8gXHJcbiAgICAgICAgICAgIC8vLyA8cGFyYT5cclxuICAgICAgICAgICAgLy8vIE5leHQgc3RhdGU6PGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyAgIC0gT24gdmFsdWUgZm91bmQ6IDxzZWUgY3JlZj1cIk1pZGRsZU9wZXJhdG9yT3JFbmRcIiAvPi48YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiBsZWZ0IG9wZXJhdG9yIGZvdW5kOiA8c2VlIGNyZWY9XCJWYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWRcIi8+PGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmE+XHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIFZhbHVlT3JMZWZ0T3BlcmF0b3JFeHBlY3RlZCxcclxuXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFRoZSBleHByZXNzaW9uIGV4cGVjdHMgYSBtaWRkbGUgb3BlcmF0b3Igb3IgdGhlIGVuZCBvZiB0aGUgZXhwcmVzc2lvbiwgbGlrZSBpbiBBICsgQiA/XHJcbiAgICAgICAgICAgIC8vLyBcclxuICAgICAgICAgICAgLy8vIDxwYXJhPlxyXG4gICAgICAgICAgICAvLy8gTmV4dCBzdGF0ZTo8YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiBvcGVyYXRvciBmb3VuZDogPHNlZSBjcmVmPVwiVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kXCIgLz4uPGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmE+XHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIE1pZGRsZU9wZXJhdG9yT3JFbmQsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgUnVzdGljU3RhY2tcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IGRpc3BsYXlJZDtcclxuICAgICAgICBwdWJsaWMgaW50IHByaW9yaXR5O1xyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNTdGFjayBwYXJlbnQ7XHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IExpc3Q8UnVzdGljT3BlcmF0aW9uPiBvcGVyYXRpb25zID0gbmV3IExpc3Q8UnVzdGljT3BlcmF0aW9uPigpO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGV4ZWN1dGVkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5wdWJsaWMgYm9vbCBDYW5CZVNpbXBsaWZpZWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG9wZXJhdGlvbnMuQ291bnQgPT0gMSAmJiBvcGVyYXRpb25zWzBdIGlzIE9wZXJhdGlvbnMuU2V0ICYmIG9wZXJhdGlvbnNbMF0ucGFyYW1ldGVyICE9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgb2JqZWN0IFJlc3VsdFZhbHVlIHtcclxuICAgICAgICAgICAgZ2V0IHtcclxuICAgICAgICAgICAgICAgIGlmIChleGVjdXRlZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUaGlzIHN0YWNrIGRpZCBub3QgZXhlY3V0ZSB5ZXRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9iamVjdCByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgIFR5cGUgcmVzdWx0VHlwZSA9IG51bGw7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNTdGFjayhpbnQgaWQsIFJ1c3RpY1N0YWNrIHBhcmVudCwgaW50IHByaW9yaXR5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5SWQgPSBpZDtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFByZXBhcmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxSdXN0aWNPcGVyYXRpb24+IG1vdmVMZWZ0VW5hcnlPcGVyYXRpb25zID0gbmV3IExpc3Q8UnVzdGljT3BlcmF0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3JlYWNoKFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24gaW4gb3BlcmF0aW9ucylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5Jc0xlZnRVbmFyeSlcclxuICAgICAgICAgICAgICAgICAgICBtb3ZlTGVmdFVuYXJ5T3BlcmF0aW9ucy5BZGQob3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IG1vdmVMZWZ0VW5hcnlPcGVyYXRpb25zLkNvdW50IC0gMTsgaSA+PSAwOyBpLS0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24gPSBtb3ZlTGVmdFVuYXJ5T3BlcmF0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMuUmVtb3ZlKG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25zLkFkZChvcGVyYXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBQcmV2aWV3UmVzdWx0VHlwZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRXhlY3V0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAwZjtcclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCBvcGVyYXRpb25zLkNvdW50OyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG9wZXJhdGlvbnNbaV0uRXhlY3V0ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV4ZWN1dGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRUeXBlID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcihpbnQgaSA9IDA7IGkgPCBvcGVyYXRpb25zLkNvdW50OyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0VHlwZSA9IG9wZXJhdGlvbnNbaV0uUHJldmlld1Jlc3VsdFR5cGUocmVzdWx0VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRUeXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RyaW5nIHN0ciA9IFwiIChcIjtcclxuICAgICAgICAgICAgaW50IGZpcnN0ID0gb3BlcmF0aW9ucy5GaW5kSW5kZXgoKFByZWRpY2F0ZTxSdXN0aWNPcGVyYXRpb24+KShvcCA9PiBvcC5Jc0xlZnRVbmFyeSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGZpcnN0ID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGkgPSBmaXJzdDsgaSA8IG9wZXJhdGlvbnMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gb3BlcmF0aW9uc1tpXS5Ub0V4cHJlc3Npb25TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGludCBpID0gMDsgaSA8IG9wZXJhdGlvbnMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnNbaV0uSXNMZWZ0VW5hcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gb3BlcmF0aW9uc1tpXS5Ub0V4cHJlc3Npb25TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3RyICs9IFwiIClcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBib29sIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19leGVjdXRlZD1mYWxzZTt9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJ1c3RpY1Rva2VuXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFJ1c3RpY1Rva2VuTW9kZSBtb2RlO1xyXG4gICAgICAgIHB1YmxpYyBvYmplY3QgdmFsdWU7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNUb2tlbihSdXN0aWNUb2tlbk1vZGUgbW9kZSwgb2JqZWN0IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBUb1N0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiUnVzdGljVG9rZW4oezB9LCBcXFwiezF9XFxcIilcIixtb2RlLHZhbHVlKTtcclxufSAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gUnVzdGljVG9rZW5Nb2RlXHJcbiAgICB7XHJcbiAgICAgICAgSWdub3JlZCxcclxuICAgICAgICBMaXRlcmFsLFxyXG4gICAgICAgIFZhcmlhYmxlTmFtZSxcclxuICAgICAgICBPcGVyYXRpb24sXHJcbiAgICAgICAgUHJpb3JpdHlPZmZzZXQsXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcblxyXG5uYW1lc3BhY2UgTGl2ZVByZXZpZXdcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBSZXN1bHRCb3g7XHJcbiAgICAgICAgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgSW5wdXRFeHByZXNzaW9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBIVE1MXHJcbiAgICAgICAgICAgIFJlc3VsdEJveCA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkPEhUTUxEaXZFbGVtZW50PihcImV4cHItcmVzdWx0Ym94XCIpO1xyXG4gICAgICAgICAgICBJbnB1dEV4cHJlc3Npb24gPSBEb2N1bWVudC5HZXRFbGVtZW50QnlJZDxIVE1MSW5wdXRFbGVtZW50PihcInRFeHByZXNzaW9uXCIpO1xyXG5cclxuICAgICAgICAgICAgSW5wdXRFeHByZXNzaW9uLk9uSW5wdXQgPSBPbklucHV0RXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgICAgIE9uSW5wdXRFeHByZXNzaW9uKG51bGwpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIElOU1RSVUNUSU9OU1xyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIEFmdGVyIGJ1aWxkaW5nIChDdHJsICsgU2hpZnQgKyBCKSB0aGlzIHByb2plY3QsIFxyXG4gICAgICAgICAgICAvLyBicm93c2UgdG8gdGhlIC9iaW4vRGVidWcgb3IgL2Jpbi9SZWxlYXNlIGZvbGRlci5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gQSBuZXcgYnJpZGdlLyBmb2xkZXIgaGFzIGJlZW4gY3JlYXRlZCBhbmRcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgeW91ciBwcm9qZWN0cyBKYXZhU2NyaXB0IGZpbGVzLiBcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gT3BlbiB0aGUgYnJpZGdlL2luZGV4Lmh0bWwgZmlsZSBpbiBhIGJyb3dzZXIgYnlcclxuICAgICAgICAgICAgLy8gUmlnaHQtQ2xpY2sgPiBPcGVuIFdpdGguLi4sIHRoZW4gY2hvb3NlIGFcclxuICAgICAgICAgICAgLy8gd2ViIGJyb3dzZXIgZnJvbSB0aGUgbGlzdC5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gVGhpcyBhcHBsaWNhdGlvbiB3aWxsIHRoZW4gcnVuIGluIHRoZSBicm93c2VyXHJcbiAgICAgICAgICAgIC8vIGFuZCB5b3Ugd2lsbCBiZSBhYmxlIHRvIHRlc3QgaXQuXHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgcHVibGljIHZvaWQgT25JbnB1dEV4cHJlc3Npb24oRXZlbnQ8SFRNTElucHV0RWxlbWVudD4gZXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljQ29udGV4dCBjb250ZXh0ID0gbmV3IFJ1c3RpY0NvbnRleHQoKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJsZVR5cGVDYXN0cyA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5EaWN0aW9uYXJ5PHN0cmluZywgVHlwZT4oKSwoX28xKT0+e19vMS5BZGQoXCJpbnRcIix0eXBlb2YoaW50KSk7X28xLkFkZChcImZsb2F0XCIsdHlwZW9mKGZsb2F0KSk7X28xLkFkZChcImRvdWJsZVwiLHR5cGVvZihkb3VibGUpKTtyZXR1cm4gX28xO30pLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlcyA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5EaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PigpLChfbzIpPT57X28yLkFkZChcIlBJXCIsTWF0aC5QSSk7cmV0dXJuIF9vMjt9KSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBSdXN0aWNFeHByIGV4cHIgPSBuZXcgUnVzdGljRXhwcihJbnB1dEV4cHJlc3Npb24uVmFsdWUsIGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgZXhwci5FeGVjdXRlKCk7XHJcbiAgICAgICAgICAgICAgICBSZXN1bHRCb3guSW5uZXJIVE1MID0gZXhwci5QcmludFRvSHRtbCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKEV4Y2VwdGlvbiBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN1bHRCb3guSW5uZXJIVE1MID0gc3RyaW5nLkZvcm1hdChcIkZpeCB5b3VyIGZvcm11bGE6IHswfVwiLGUuTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9leHByLlByaW50RGVidWcoKTsgLy8gQ29uc29sZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBMaXZlUHJldmlld1xyXG57XHJcbiAgICBzdGF0aWMgY2xhc3MgQnJpZGdlUHJpbnRIdG1sXHJcbiAgICB7XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBzdHJpbmcgUHJpbnRUb0h0bWwodGhpcyBSdXN0aWNFeHByIGV4cHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgaHRtbCA9IHN0cmluZy5Gb3JtYXQoXCI8ZGl2IGNsYXNzPVxcXCJleHByLXJlc3VsdFxcXCI+UmVzdWx0OiB7MH08L2Rpdj5cIixleHByLnN0YWNrc1swXS5SZXN1bHRWYWx1ZSk7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGFibGUgd2lkdGg9MTAwJT5cIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFRhYmxlIEhlYWRcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0aGVhZD5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0aD5TdGFjayBSZWdpc3RlcjwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGggd2lkdGg9NTAlPk9wZXJhdGlvbjwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGggd2lkdGg9MjAlPlJlc3VsdDwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGg+VHlwZTwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPC90aGVhZD5cIjtcclxuXHJcbiAgICAgICAgICAgIC8vIFRhYmxlIEJvZHlcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0Ym9keT5cIjtcclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2godmFyIHN0YWNrIGluIGV4cHIuc3RhY2tzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBib29sIGlzRmlyc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgVHlwZSBwcmV2VHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QgcmVzdWx0VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCh2YXIgb3BlcmF0aW9uIGluIHN0YWNrLm9wZXJhdGlvbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RhY2sgUmVnaXN0ZXIgY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gc3RyaW5nLkZvcm1hdChcIjx0ZCByb3dzcGFuPSd7MH0nPlJ7MX08L3RkPlwiLHN0YWNrLm9wZXJhdGlvbnMuQ291bnQgKyAxLHN0YWNrLmRpc3BsYXlJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFR5cGUgb3BSZXN1bHRUeXBlID0gb3BlcmF0aW9uLlByZXZpZXdSZXN1bHRUeXBlKHByZXZUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRWYWx1ZSA9IG9wZXJhdGlvbi5FeGVjdXRlKHJlc3VsdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYXRpb25zIGNvbHVtblxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gc3RyaW5nLkZvcm1hdChcIjx0ZD57MH17MX08L3RkPlwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwob3BlcmF0aW9uLnBhcmFtZXRlciAhPSBudWxsID8gXCIgXCIgKyBvcGVyYXRpb24ucGFyYW1ldGVyIDogXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc3VsdCBjb2x1bW5cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IHN0cmluZy5Gb3JtYXQoXCI8dGQ+UnswfTogezF9PC90ZD5cIixzdGFjay5kaXNwbGF5SWQscmVzdWx0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFR5cGUgY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBzdHJpbmcuRm9ybWF0KFwiPHRkIHN0eWxlPSd3aGl0ZS1zcGFjZTogbm93cmFwJz57MH0oezF9LCB7Mn0pOiB7M308L3RkPlwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwocHJldlR5cGUhPW51bGw/cHJldlR5cGUuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiLChvcGVyYXRpb24ucGFyYW1ldGVyICE9IG51bGwgPyBcIiBcIiArIG9wZXJhdGlvbi5wYXJhbWV0ZXJUeXBlLk5hbWUgOiBcIm51bGxcIiksb3BSZXN1bHRUeXBlLk5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPC90cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlR5cGUgPSBvcFJlc3VsdFR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBzdHJpbmcuRm9ybWF0KFwiPHRyIHN0eWxlPSdmb250LXdlaWdodDpib2xkJz48dGQ+UmV0dXJuPC90ZD48dGQ+UnswfTogezF9PC90ZD48dGQ+ezJ9PC90ZD48L3RyPlwiLHN0YWNrLmRpc3BsYXlJZCxzdGFjay5SZXN1bHRWYWx1ZSA/PyBcIm51bGxcIiwoZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixzdGFjay5SZXN1bHRWYWx1ZSkhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPG9iamVjdD4oXCJrZXkxXCIpLkdldFR5cGUoKS5OYW1lOihzdHJpbmcpbnVsbCkgPz8gXCJudWxsXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBodG1sICs9IFwiPC90Ym9keT5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjwvdGFibGU+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uRXZhbHVhdG9yc1xue1xuICAgIGNsYXNzIExpdGVyYWwgOiBSdXN0aWNWYWx1ZUV2YWx1YXRvclxuICAgIHtcbiAgICAgICAgb2JqZWN0IHZhbHVlO1xucHVibGljIExpdGVyYWwob2JqZWN0IHZhbHVlKVxyXG57XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEdldFZhbHVlKClcclxue1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59cHVibGljIG92ZXJyaWRlIFR5cGUgR2V0VmFsdWVUeXBlKClcclxue1xyXG4gICAgcmV0dXJuIHZhbHVlLkdldFR5cGUoKTtcclxufXB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcInswfVwiLHZhbHVlKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uRXZhbHVhdG9yc1xyXG57XHJcbiAgICBjbGFzcyBTdGFja1JlZmVyZW5jZSA6IFJ1c3RpY1ZhbHVlRXZhbHVhdG9yXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFJ1c3RpY1N0YWNrIHN0YWNrIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTdGFja1JlZmVyZW5jZShSdXN0aWNTdGFjayBzdGFjaylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2sgPSBzdGFjaztcclxuICAgICAgICB9XHJcbnB1YmxpYyBvdmVycmlkZSBvYmplY3QgR2V0VmFsdWUoKVxyXG57XHJcbiAgICByZXR1cm4gc3RhY2suUmVzdWx0VmFsdWU7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgVHlwZSBHZXRWYWx1ZVR5cGUoKVxyXG57XHJcbiAgICByZXR1cm4gc3RhY2suUHJldmlld1Jlc3VsdFR5cGUoKTtcclxufXB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIlJ7MH1cIixzdGFjay5kaXNwbGF5SWQpO1xyXG59ICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uRXZhbHVhdG9yc1xue1xuICAgIGNsYXNzIFZhcmlhYmxlOiBSdXN0aWNWYWx1ZUV2YWx1YXRvclxuICAgIHtcbiAgICAgICAgUnVzdGljQ29udGV4dCBjb250ZXh0O1xuICAgICAgICBzdHJpbmcgdmFyaWFibGVOYW1lO1xuICAgICAgICBUeXBlIHZhcmlhYmxlVHlwZTtcbiAgICAgICAgcHVibGljIFZhcmlhYmxlKFJ1c3RpY0NvbnRleHQgY29udGV4dCwgc3RyaW5nIHZhcmlhYmxlSWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlTmFtZSA9IHZhcmlhYmxlSWQ7XG4gICAgICAgICAgICB2YXJpYWJsZVR5cGUgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLEdldFZhbHVlKCkpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxvYmplY3Q+KFwia2V5MVwiKS5HZXRUeXBlKCk6KFR5cGUpbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEdldFZhbHVlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9iamVjdCB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICgoY29udGV4dCE9bnVsbD9jb250ZXh0LnZhcmlhYmxlcy5UcnlHZXRWYWx1ZSh2YXJpYWJsZU5hbWUsIG91dCB2YWx1ZSk6KGJvb2w/KW51bGwpID09IHRydWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiVW5kZWZpbmVkIHZhcmlhYmxlIFxcXCJ7MH1cXFwiXCIsdmFyaWFibGVOYW1lKSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgVHlwZSBHZXRWYWx1ZVR5cGUoKVxyXG57XHJcbiAgICByZXR1cm4gdmFyaWFibGVUeXBlO1xyXG59cHVibGljIG92ZXJyaWRlIHN0cmluZyBUb1N0cmluZygpXHJcbntcclxuICAgIHJldHVybiB2YXJpYWJsZU5hbWU7XHJcbn0gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnNcclxue1xyXG4gICAgY2xhc3MgQWRkIDogUnVzdGljT3BlcmF0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xyXG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmMoc3RvcmVkLCBwYXJhbWV0ZXJWYWx1ZSk7XHJcbn1wcm90ZWN0ZWQgb3ZlcnJpZGUgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKVxyXG57XHJcbiAgICByZXR1cm4gRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uUnVzdGljT3BlcmF0aW9uLlByaW9yaXR5LkFkZFN1YjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguQWRkW3R5cGVvZihkb3VibGUpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGZsb2F0KSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihmbG9hdCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5BZGRbdHlwZW9mKGZsb2F0KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGZsb2F0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGludCkgJiYgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoaW50KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLkFkZFt0eXBlb2YoaW50KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKFwiQ291bGQgbm90IGluZmVyIHRoZSByZXN1bHRpbmcgdHlwZVwiKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgKyB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXG57XG4gICAgY2xhc3MgRGl2IDogUnVzdGljT3BlcmF0aW9uXG4gICAge1xuICAgICAgICBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+IGZ1bmM7XG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmMoc3RvcmVkLCBwYXJhbWV0ZXJWYWx1ZSk7XHJcbn1wcm90ZWN0ZWQgb3ZlcnJpZGUgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKVxyXG57XHJcbiAgICByZXR1cm4gRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uUnVzdGljT3BlcmF0aW9uLlByaW9yaXR5Lk11bERpdjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihkb3VibGUpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGRvdWJsZSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLkRpdlt0eXBlb2YoZG91YmxlKV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihkb3VibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihmbG9hdCkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZmxvYXQpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5EaXZbdHlwZW9mKGZsb2F0KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihmbG9hdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGludCkgJiYgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoaW50KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguRGl2W3R5cGVvZihpbnQpXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKFwiQ291bGQgbm90IGluZmVyIHRoZSByZXN1bHRpbmcgdHlwZVwiKTtcbiAgICAgICAgfVxucHVibGljIG92ZXJyaWRlIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiAvIHswfVwiLGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIscGFyYW1ldGVyKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8UnVzdGljVmFsdWVFdmFsdWF0b3I+KFwia2V5MVwiKS5Ub1N0cmluZygpOihzdHJpbmcpbnVsbCk7XHJcbn0gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xuXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uT3BlcmF0aW9uc1xue1xuICAgIGNsYXNzIE11bCA6IFJ1c3RpY09wZXJhdGlvblxuICAgIHtcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgcGFyYW1ldGVyVmFsdWUpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5NdWxEaXY7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5NdWxbdHlwZW9mKGRvdWJsZSldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZmxvYXQpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGZsb2F0KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguTXVsW3R5cGVvZihmbG9hdCldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZmxvYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihpbnQpICYmIHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGludCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLk11bFt0eXBlb2YoaW50KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihcIkNvdWxkIG5vdCBpbmZlciB0aGUgcmVzdWx0aW5nIHR5cGVcIik7XG4gICAgICAgIH1cbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgKiB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXHJcbntcclxuICAgIGNsYXNzIFBvdyA6IFJ1c3RpY09wZXJhdGlvblxyXG4gICAge1xyXG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIE1hdGguUG93KENvbnZlcnQuVG9Eb3VibGUoc3RvcmVkKSwgQ29udmVydC5Ub0RvdWJsZShwYXJhbWV0ZXJWYWx1ZSkpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5Qb3c7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIHR5cGVvZihkb3VibGUpO1xyXG59I2lmIFVOSVRZX0VESVRPUlxyXG4gICAgICAgIFByZXZpZXdSZXN1bHRUeXBlIHNob3VsZCBjb25zaWRlciBmbG9hdCBhbmQgZG91YmxlIHdpdGggTWF0aGYuUG93LlxyXG4jZW5kaWZcclxucHVibGljIG92ZXJyaWRlIGJvb2wgSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKClcclxue1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiICoqICh7MH0pXCIsZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLlRvU3RyaW5nKCk6KHN0cmluZyludWxsKTtcclxufSAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xuXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uT3BlcmF0aW9ucy5QcmVmaXhVbmFyeVxue1xuICAgIGNsYXNzIE5lZ2F0aXZlIDogUnVzdGljT3BlcmF0aW9uXG4gICAge1xuICAgICAgICBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+IGZ1bmM7XG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmMoc3RvcmVkLCBudWxsKTtcclxufXByb3RlY3RlZCBvdmVycmlkZSBQcmlvcml0eSBHZXRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5SdXN0aWNPcGVyYXRpb24uUHJpb3JpdHkuUHJlZml4VW5hcnk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGRvdWJsZSkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZG91YmxlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLk5lZ2F0aXZlW3R5cGVvZihkb3VibGUpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGZsb2F0KSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihmbG9hdCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5OZWdhdGl2ZVt0eXBlb2YoZmxvYXQpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZmxvYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLk5lZ2F0aXZlW3R5cGVvZihpbnQpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiAtXCIpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcblxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnMuUHJlZml4VW5hcnlcbntcbiAgICBjbGFzcyBQb3NpdGl2ZSA6IFJ1c3RpY09wZXJhdGlvblxuICAgIHtcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgbnVsbCk7XHJcbn1wcm90ZWN0ZWQgb3ZlcnJpZGUgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKVxyXG57XHJcbiAgICByZXR1cm4gRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uUnVzdGljT3BlcmF0aW9uLlByaW9yaXR5LlByZWZpeFVuYXJ5O1xyXG59XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFR5cGUgUHJldmlld1Jlc3VsdFR5cGUoVHlwZSBpbmNvbWluZ1N0b3JlZFR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihkb3VibGUpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGRvdWJsZSkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5Qb3NpdGl2ZVt0eXBlb2YoZG91YmxlKV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRvdWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihmbG9hdCkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZmxvYXQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguUG9zaXRpdmVbdHlwZW9mKGZsb2F0KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGZsb2F0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5Qb3NpdGl2ZVt0eXBlb2YoaW50KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgK1wiKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zLlByZWZpeFVuYXJ5XG57XG4gICAgY2xhc3MgVHlwZUNhc3QgOiBSdXN0aWNPcGVyYXRpb25cbiAgICB7XG4gICAgICAgIFR5cGUgcmVmZXJlbmNlVHlwZTtcblxuICAgICAgICBwdWJsaWMgVHlwZUNhc3QoVHlwZSByZWZlcmVuY2VUeXBlKSA6IGJhc2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZlcmVuY2VUeXBlID0gcmVmZXJlbmNlVHlwZTtcclxuICAgICAgICB9XG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuQ2hhbmdlVHlwZShzdG9yZWQsIHJlZmVyZW5jZVR5cGUpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5QcmVmaXhVbmFyeTtcclxufXB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gcmVmZXJlbmNlVHlwZTtcclxufXB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgKHswfSlcIixyZWZlcmVuY2VUeXBlLk5hbWUpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXG57XG4gICAgY2xhc3MgU2V0IDogUnVzdGljT3BlcmF0aW9uXG4gICAge1xucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBwYXJhbWV0ZXJWYWx1ZTtcclxufXByb3RlY3RlZCBvdmVycmlkZSBQcmlvcml0eSBHZXRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5SdXN0aWNPcGVyYXRpb24uUHJpb3JpdHkuSWdub3JlZDtcclxufXB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gcGFyYW1ldGVyVHlwZTtcclxufXB1YmxpYyBvdmVycmlkZSBib29sIEhhc1JpZ2h0VG9MZWZ0UHJlY2VkZW5jZSgpXHJcbntcclxuICAgIHJldHVybiB0cnVlO1xyXG59cHVibGljIG92ZXJyaWRlIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXHJcbntcclxuICAgIGNsYXNzIFN1YiA6IFJ1c3RpY09wZXJhdGlvblxyXG4gICAge1xyXG4gICAgICAgIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4gZnVuYztcclxucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgcGFyYW1ldGVyVmFsdWUpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5BZGRTdWI7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGRvdWJsZSkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZG91YmxlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLlN1Ylt0eXBlb2YoZG91YmxlKV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRvdWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihmbG9hdCkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZmxvYXQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguU3ViW3R5cGVvZihmbG9hdCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihmbG9hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihpbnQpICYmIHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGludCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5TdWJbdHlwZW9mKGludCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihcIkNvdWxkIG5vdCBpbmZlciB0aGUgcmVzdWx0aW5nIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiIC0gezB9XCIsZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLlRvU3RyaW5nKCk6KHN0cmluZyludWxsKTtcclxufSAgICB9XHJcbn1cclxuIl0KfQo=
