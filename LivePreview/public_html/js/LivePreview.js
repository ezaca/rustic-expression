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
            variables: null
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
            $ctor1: function (expression) {
                ExpressionStack.RusticExpression.RusticExpr.ctor.call(this);
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
            PutValueToken: function (value) {
                if (this.nextOperation == null) {
                    throw new System.Exception("Expecting operator, but received value");
                }
                this.nextOperation.parameter = new ExpressionStack.RusticExpression.Evaluators.Literal(value);
                this.currentStack.operations.add(this.nextOperation);
                this.nextOperation = null;
            },
            PutVariableToken: function (variableName) {
                if (this.nextOperation == null) {
                    throw new System.Exception("Expecting operator, but received value");
                }
                this.nextOperation.parameter = new ExpressionStack.RusticExpression.Evaluators.Variable(this.context, variableName);
                this.currentStack.operations.add(this.nextOperation);
                this.nextOperation = null;
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
                    throw new System.Exception("Unexpected operator found");
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
                var $t;
                var index = 0;

                $t = Bridge.getEnumerator(this.stacks);
                try {
                    while ($t.moveNext()) {
                        var stack = $t.Current;
                        stack.displayId = ((index = (index + 1) | 0));
                        stack.Prepare();
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
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
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.OperationCapture)).ctor());
                this.LeftOperators = function (_o4) {
                        _o4.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[+](?![.0-9])", new ExpressionStack.RusticExpression.Operations.PrefixUnary.Positive()));
                        _o4.add(new ExpressionStack.RusticExpression.RusticParser.OperationCapture("[-](?![.0-9])", new ExpressionStack.RusticExpression.Operations.PrefixUnary.Negative()));
                        return _o4;
                    }(new (System.Collections.Generic.List$1(ExpressionStack.RusticExpression.RusticParser.OperationCapture)).ctor());
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
                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.openGroupExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorOrEnd);
                    return this.OpenGroupPattern.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken(this, match.getValue());
                }

                if (((match = ExpressionStack.RusticExpression.RusticParser.StickyMatch(this.leftOpExpr, expression, index))).getSuccess()) {
                    this.currentState.Push(ExpressionStack.RusticExpression.RusticParser.ParsingState.ValueOrLeftOperatorExpected);
                    return this.LeftOperators.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken();
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
                    return this.MiddleOperators.getItem(((ExpressionStack.RusticExpression.RusticParser.FindSuccededGroupIndex(match) - 1) | 0)).ToToken();
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
                this.value = value;
                this.mode = mode;
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

    Bridge.define("ExpressionStack.RusticExpression.RusticParser.OperationCapture", {
        $kind: "nested class",
        fields: {
            pattern: null,
            operation: null
        },
        ctors: {
            ctor: function (pattern, operation) {
                this.$initialize();
                this.pattern = pattern;
                this.operation = operation;
            }
        },
        methods: {
            ToToken: function () {
                return new ExpressionStack.RusticExpression.RusticToken(ExpressionStack.RusticExpression.RusticTokenMode.Operation, Bridge.createInstance(Bridge.getType(this.operation)));
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
                for (var i = 0; i < this.operations.Count; i = (i + 1) | 0) {
                    str = (str || "") + ((this.operations.getItem(i).ToExpressionString()) || "");
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
                    try {
                        var expr = new ExpressionStack.RusticExpression.RusticExpr.$ctor1(LivePreview.App.InputExpression.value);
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
                return System.String.format(" *-1 {0}", [(this.parameter != null ? Bridge.Reflection.getTypeName(Bridge.getType(this.parameter)) : "null")]);
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
                return System.String.format("", null);
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
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJMaXZlUHJldmlldy5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiUnVzdGljRXhwcmVzc2lvbi9EZWJ1Z0V4dGVuc2lvbi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljVmFsdWVFdmFsdWF0b3IuY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY09wZXJhdGlvbi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9Qcm92aWRlcnMvQ29tbW9uTWF0aC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljQ29udGV4dC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljRXhwci5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljRXhwckJ1aWxkZXIuY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY1BhcnNlci5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vUnVzdGljU3RhY2suY3MiLCJSdXN0aWNFeHByZXNzaW9uL1J1c3RpY1Rva2VuLmNzIiwiQXBwLmNzIiwiQnJpZGdlUHJpbnRIdG1sLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9FdmFsdWF0b3JzL0xpdGVyYWwuY3MiLCJSdXN0aWNFeHByZXNzaW9uL0V2YWx1YXRvcnMvU3RhY2tSZWZlcmVuY2UuY3MiLCJSdXN0aWNFeHByZXNzaW9uL0V2YWx1YXRvcnMvVmFyaWFibGUuY3MiLCJSdXN0aWNFeHByZXNzaW9uL09wZXJhdGlvbnMvQWRkLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL0Rpdi5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9NdWwuY3MiLCJSdXN0aWNFeHByZXNzaW9uL09wZXJhdGlvbnMvUG93LmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1ByZWZpeFVuYXJ5L05lZ2F0aXZlLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1ByZWZpeFVuYXJ5L1Bvc2l0aXZlLmNzIiwiUnVzdGljRXhwcmVzc2lvbi9PcGVyYXRpb25zL1NldC5jcyIsIlJ1c3RpY0V4cHJlc3Npb24vT3BlcmF0aW9ucy9TdWIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O3NDQVVzQ0E7O29CQUUxQkEsYUFBMkJBO29CQUMzQkEsS0FBS0EsUUFBUUEsd0JBQWtCQSxRQUFRQTt3QkFHbkNBLHlCQUFrQkEsaUVBQThCQSw2QkFBRUEsMEJBQU9BLDRDQUE0QkEsZUFBT0E7d0JBQzVGQSxJQUFJQSxlQUFPQTs0QkFFUEEseUJBQWtCQTs7NEJBSWxCQSxlQUFnQkE7NEJBQ2hCQSxLQUFLQSxXQUFXQSxJQUFJQSxlQUFPQSxxQkFBcUJBO2dDQUU1Q0EsZ0JBQTRCQSxlQUFPQSxzQkFBY0E7Z0NBQ2pEQSx5QkFBa0JBLCtEQUE0QkEsMERBQXlCQSxDQUFDQSx1QkFBdUJBLFlBQVlBLDJCQUFPQSx1Q0FBcUNBLCtDQUF1Q0EsMERBQXlCQSxPQUFDQSxZQUFVQSxPQUFLQSwwQ0FBY0EsQUFBUUEsb0JBQXRDQSxjQUFzREEsUUFBQ0EsT0FBb0NBLDRCQUEwQkEsT0FBS0EscUNBQWtEQSxBQUFRQSxxQkFBOUhBLGVBQThJQSwwREFBNEJBO2dDQUN2YkEsV0FBV0EsNEJBQTRCQTs7Ozt3QkFJL0NBLElBQUlBLGVBQU9BOzRCQUVQQSx5QkFBa0JBLHNFQUFrQ0EsZUFBT0EsaUNBQStCQSxpQ0FBd0JBLFFBQUNBLE9BQW9DQSxlQUFPQSxtQkFBaUJBLE9BQUtBLHFEQUE4REEsQUFBUUEscUJBQXhJQTs7d0JBRXRIQTs7Ozs7Ozs7O2dDQzVCRUE7Z0JBRWRBLE9BQU9BLFlBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkNLTkEsT0FBT0E7Ozs7OztvQkFNUEEsT0FBT0EsTUFBb0NBLG1CQUFZQSxPQUFLQSxvQkFBNEVBLEFBQU1BOzs7Ozs7Z0JBUWxKQSxPQUFPQSxFQUFLQSxxQkFBZ0JBOzs7Z0JBRzVCQSxPQUFPQSxDQUFDQSxrQkFBYUEsU0FBU0EsQ0FBQ0E7OztnQkFHL0JBLE9BQU9BLCtCQUF1QkEscURBQWVBLENBQUNBLGtCQUFhQSxPQUFPQTs7O2dCQUdsRUEsT0FBT0EsZ0NBQXdCQSxxREFBZUEsQ0FBQ0Esa0JBQWFBLE9BQU9BLDBCQUFNQTs7O2dCQUd6RUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQ0NsQzRFQSxBQUFtRkEsVUFBQ0E7NEJBQU9BLFFBQVFBLEFBQU9BLGVBQU9BOzRCQUFnQkEsUUFBUUEsQUFBT0EsZUFBUUE7NEJBQWdCQSxRQUFRQSxBQUFPQSxjQUFLQTs0QkFBZUEsT0FBT0E7MEJBQXBMQSxLQUFJQTtvQ0FXbENBLEFBQW1GQSxVQUFDQTs0QkFBT0EsUUFBUUEsQUFBT0EsZUFBT0E7NEJBQWdCQSxRQUFRQSxBQUFPQSxlQUFRQTs0QkFBZ0JBLFFBQVFBLEFBQU9BLGNBQUtBOzRCQUFlQSxPQUFPQTswQkFBcExBLEtBQUlBOytCQVd2Q0EsQUFBbUZBLFVBQUNBOzRCQUFPQSxRQUFRQSxBQUFPQSxlQUFPQTs0QkFBV0EsUUFBUUEsQUFBT0EsZUFBUUE7NEJBQVdBLFFBQVFBLEFBQU9BLGNBQUtBOzRCQUFVQSxPQUFPQTswQkFBcktBLEtBQUlBOytCQVdsQ0EsQUFBbUZBLFVBQUNBOzRCQUFPQSxRQUFRQSxBQUFPQSxlQUFPQTs0QkFBV0EsUUFBUUEsQUFBT0EsZUFBUUE7NEJBQVdBLFFBQVFBLEFBQU9BLGNBQUtBOzRCQUFVQSxPQUFPQTswQkFBcktBLEtBQUlBOytCQVdsQ0EsQUFBbUZBLFVBQUNBOzRCQUFPQSxRQUFRQSxBQUFPQSxlQUFPQTs0QkFBV0EsUUFBUUEsQUFBT0EsZUFBUUE7NEJBQVdBLFFBQVFBLEFBQU9BLGNBQUtBOzRCQUFVQSxPQUFPQTswQkFBcktBLEtBQUlBOytCQVdsQ0EsQUFBbUZBLFVBQUNBOzRCQUFPQSxRQUFRQSxBQUFPQSxlQUFPQTs0QkFBV0EsUUFBUUEsQUFBT0EsZUFBUUE7NEJBQVdBLFFBQVFBLEFBQU9BLGNBQUtBOzRCQUFVQSxPQUFPQTswQkFBcktBLEtBQUlBOytCQWNsQ0EsQUFBbUZBLFVBQUNBOzRCQUFPQSxRQUFRQSxBQUFPQSxlQUFPQTs0QkFBV0EsUUFBUUEsQUFBT0EsZUFBUUE7NEJBQVdBLFFBQVFBLEFBQU9BLGNBQUtBOzRCQUFVQSxPQUFPQTswQkFBcktBLEtBQUlBOzs7OzBDQXBFaEZBLEdBQVVBO29CQUVuQ0EsT0FBT0EsWUFBQ0Esd0JBQWlCQTs7MENBQ0NBLEdBQVVBO29CQUVwQ0EsT0FBT0EsWUFBQ0Esd0JBQWlCQTs7eUNBQ0FBLEdBQVVBO29CQUVuQ0EsT0FBT0EsY0FBQ0EsdUJBQWdCQTs7MENBR0NBLEdBQVVBO29CQUVuQ0EsT0FBT0EsbUNBQWlCQTs7MENBQ0VBLEdBQVVBO29CQUVwQ0EsT0FBT0EsbUNBQWlCQTs7eUNBQ0NBLEdBQVVBO29CQUVuQ0EsT0FBT0Esa0NBQWdCQTs7cUNBR0hBLEdBQVVBO29CQUU5QkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztxQ0FDekJBLEdBQVVBO29CQUUvQkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztvQ0FDMUJBLEdBQVVBO29CQUU5QkEsT0FBT0Esb0NBQWdCQSxLQUFLQSx1QkFBZ0JBOztxQ0FHeEJBLEdBQVVBO29CQUU5QkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztxQ0FDekJBLEdBQVVBO29CQUUvQkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztvQ0FDMUJBLEdBQVVBO29CQUU5QkEsT0FBT0Esb0NBQWdCQSxLQUFLQSx1QkFBZ0JBOztxQ0FHeEJBLEdBQVVBO29CQUU5QkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztxQ0FDekJBLEdBQVVBO29CQUUvQkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztvQ0FDMUJBLEdBQVVBO29CQUU5QkEsT0FBT0EsaURBQWdCQSxJQUFLQSx1QkFBZ0JBOztxQ0FHeEJBLEdBQVVBO29CQUU5QkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztxQ0FDekJBLEdBQVVBO29CQUUvQkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztvQ0FDMUJBLEdBQVVBO29CQUU5QkEsT0FBT0EsbURBQWdCQSxJQUFLQSx1QkFBZ0JBOztrQ0FDbkJBLEdBQVVBO29CQUVuQ0EsT0FBT0EsbURBQWdCQSxJQUFLQSx1QkFBZ0JBOztxQ0FHeEJBLEdBQVVBO29CQUU5QkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztxQ0FDekJBLEdBQVVBO29CQUUvQkEsT0FBT0EsbUNBQWlCQSxLQUFLQSx3QkFBaUJBOztvQ0FDMUJBLEdBQVVBO29CQUU5QkEsT0FBT0Esa0NBQWdCQSxLQUFLQSx1QkFBZ0JBOzs7Ozs7Ozs7Ozs7OztvQkMxRXhDQSxPQUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7eUNDQWlCQTtvQkFFNUJBLE9BQU9BOzs7Ozs7Ozs7OzhCQUV3Q0EsS0FBSUE7Ozs7Z0JBS25EQTs7OEJBQ2VBOztnQkFFZkEsbUJBQWNBOzs7OztnQkFJTkE7Z0JBQ0FBLGVBQVVBLElBQUlBOztxQ0FHUUE7Z0JBRXRCQSxJQUFJQTtvQkFDQUEsSUFBSUEsMERBQWtCQSxNQUFNQSxjQUFTQTs7b0JBRXJDQSxJQUFJQSwwREFBa0JBLE1BQU1BLGNBQVNBOzs7O2dCQUt6Q0EsS0FBS0EsUUFBUUEsNkJBQWtCQSxRQUFRQTtvQkFFbkNBLG9CQUFPQTs7O2dCQUdYQSxPQUFPQTs7Ozs7Ozs7OENDNEoyQkE7b0JBRWxDQSxjQUE0QkEsSUFBSUE7b0JBQ2hDQSxxQkFBcUJBO29CQUNyQkE7Ozs7Ozs7Ozs7Ozs7O29CQTdMSkEsT0FBT0EsbUJBQVlBLE9BQUtBLHlCQUFrQkEsQUFBbUJBOzs7Ozs7cUZBR3hCQSxNQUFNQTs7OEJBRWxCQSxZQUF1QkE7OztnQkFFNUNBLElBQUlBLG9CQUFDQSxjQUFZQSxPQUFLQSwwQkFBd0JBLEFBQU1BO29CQUNoREEsTUFBTUEsSUFBSUE7OztnQkFFZEEsa0JBQWtCQTtnQkFDbEJBLGVBQWVBO2dCQUNmQSxxQkFBZ0JBLElBQUlBO2dCQUNwQkE7Z0JBQ0FBLE1BQW9DQSxnQkFBU0EsT0FBS0EsQUFBcUNBLE9BQThEQSxJQUFJQSxnREFBZUEsWUFBV0E7Z0JBQ25MQSxvQkFBZUEsT0FBb0NBLGdCQUFTQSxPQUFLQSxpQkFBNkRBLEFBQWFBOzs4QkFFOUhBLFlBQXVCQSxTQUF1QkE7cUZBQTZCQSxZQUFZQTtnQkFFNUdBLHVCQUFrQkE7OzhCQUNJQSxZQUF1QkEsU0FBdUJBO3FGQUErQkEsWUFBWUE7Z0JBRS9HQSxlQUFVQTs7Ozt5Q0FFd0JBOztnQkFFMUJBLGFBQXNCQSxJQUFJQSw4Q0FBYUE7Z0JBQ3ZDQSxlQUFVQSxNQUFtQkEsMEVBQWFBLG9CQUFvQkE7O2lDQUc1Q0E7OztnQkFFbEJBLDBCQUFzQkE7Ozs7d0JBQ2xCQSxjQUFTQTs7Ozs7Ozs7Z0NBR0lBO2dCQUVqQkEsUUFBUUE7b0JBRUpBLEtBQUtBO3dCQUF5QkEsbUJBQWNBO3dCQUFjQTtvQkFDMURBLEtBQUtBO3dCQUE4QkEsc0JBQWlCQTt3QkFBeUJBO29CQUM3RUEsS0FBS0E7d0JBQTJCQSx1QkFBa0JBLFlBQWlCQTt3QkFBY0E7b0JBQ2pGQSxLQUFLQTt3QkFBZ0NBLG9CQUFlQSxxQ0FBS0E7d0JBQWNBO29CQUN2RUE7d0JBQVNBLE1BQU1BLElBQUlBOzs7cUNBSUFBO2dCQUV2QkEsSUFBSUEsc0JBQWlCQTtvQkFDakJBLE1BQU1BLElBQUlBOztnQkFDZEEsK0JBQTBCQSxJQUFJQSxvREFBbUJBO2dCQUNqREEsaUNBQTRCQTtnQkFDNUJBLHFCQUFnQkE7O3dDQUdVQTtnQkFFMUJBLElBQUlBLHNCQUFpQkE7b0JBQ2pCQSxNQUFNQSxJQUFJQTs7Z0JBQ2RBLCtCQUEwQkEsSUFBSUEscURBQW9CQSxjQUFTQTtnQkFDM0RBLGlDQUE0QkE7Z0JBQzVCQSxxQkFBZ0JBOztzQ0FHUUE7Z0JBRXhCQSw2Q0FBa0JBO2dCQUNsQkEsSUFBSUE7b0JBRUFBLGVBQXVCQSxJQUFJQSw2Q0FBWUEsbUJBQWNBLG1CQUFjQSx3QkFBaUJBO29CQUNwRkEsK0JBQTBCQSxJQUFJQSwyREFBMEJBO29CQUN4REEsaUNBQTRCQTtvQkFDNUJBLFlBQVlBLG9CQUFlQTtvQkFDM0JBLG1CQUFjQSxtQkFBV0E7b0JBQ3pCQSxvQkFBZUE7b0JBQ2ZBLHFCQUFnQkEsSUFBSUE7Ozt5Q0FJR0E7Z0JBRTNCQSxJQUFJQSxzQkFBaUJBO29CQUNqQkEsTUFBTUEsSUFBSUE7OztnQkFFZEEsMkJBQTJCQTtnQkFDM0JBLElBQUlBLHFDQUFxQ0EsQUFBS0E7b0JBQzFDQSwwQ0FBcUNBOztvQkFFekNBLElBQUlBLENBQUNBLHdDQUF3Q0EsOEJBQXlCQSxzQ0FBc0NBLDZCQUF3QkE7d0JBQ2hJQSxrQ0FBNkJBOzt3QkFFakNBLElBQUlBLDZCQUF3QkE7NEJBQ3hCQSxpQ0FBNEJBOzs0QkFFNUJBLDBDQUFxQ0E7Ozs7O29EQUdIQTtnQkFFdENBLHFCQUFnQkE7Z0JBQ2hCQSw2QkFBeUNBLHFDQUF3QkE7Z0JBQ2pFQSx5QkFBMENBO2dCQUMxQ0EsZUFBdUJBLElBQUlBLDZDQUFZQSxtQkFBY0EsbUJBQWNBO2dCQUNuRUEsbUNBQW1DQSxJQUFJQSwyREFBMEJBO2dCQUNqRUEsc0JBQWtDQSxJQUFJQTtnQkFDdENBLDRCQUE0QkE7Z0JBQzVCQSx3QkFBd0JBO2dCQUN4QkEsWUFBWUEsb0JBQWVBO2dCQUMzQkEsbUJBQWNBLG1CQUFXQTtnQkFDekJBLG9CQUFlQTs7bURBR3NCQTtnQkFFckNBLHFCQUFnQkE7Z0JBQ2hCQSxPQUFPQSw2QkFBd0JBO29CQUMzQkEsb0JBQWVBOzs7Z0JBRW5CQSxJQUFJQSw2QkFBd0JBO29CQUN4QkEsa0NBQTZCQTs7OzREQUdhQTtnQkFFOUNBLHFCQUFnQkE7Ozs7Z0JBS2hCQTs7Z0JBRUFBLDBCQUE4QkE7Ozs7d0JBRTFCQSxrQkFBb0JBO3dCQUNwQkE7Ozs7Ozs7Ozs7Z0JBTUpBLGNBQStCQTtnQkFDL0JBLDBCQUE4QkE7Ozs7d0JBRTFCQSwyQkFBc0NBOzs7O2dDQUVsQ0EsZ0JBQXNDQTtnQ0FDdENBLGtCQUFtQkEsdUJBQXVCQSxRQUFRQSxDQUFDQSxhQUFZQSxnR0FBcURBO2dDQUNwSEEsc0JBQXVCQSxlQUFlQTtnQ0FDdENBLElBQUlBO29DQUVBQSxzQkFBc0JBO29DQUN0QkEsVUFBVUEsV0FBV0EsS0FBSUE7b0NBQ3pCQSxZQUFZQTs7Ozs7Ozs7Ozs7Ozs7O2dCQUt4QkEsSUFBSUEsV0FBV0E7b0JBQ1hBLDJCQUE2QkE7Ozs7NEJBQ3pCQSxtQkFBY0E7Ozs7Ozs7OztnQkFHdEJBLElBQUlBLHlCQUFvQkE7b0JBRXBCQTtvQkFDQUEsSUFBSUEsQ0FBQ0EsT0FBTUEsOEdBQThDQTt3QkFFckRBO3dCQUNBQSxhQUFvQkEsQUFBQ0EsWUFBMkJBO3dCQUNoREEsMkNBQThCQTt3QkFDOUJBLGtDQUFxQkE7d0JBQ3JCQSxtQkFBY0E7OztnQkFHdEJBOzs7Z0JBS0FBO2dCQUNBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5Q0N6RHdCQSxPQUFjQTs7b0JBRXRDQSxlQUFlQSx1QkFBZ0JBLDZCQUFjQTtvQkFDN0NBLElBQUlBO3dCQUNBQSxPQUFPQTs7b0JBQ1hBLE9BQU9BLGtDQUFnQkE7O3lDQUdDQSxPQUFjQTs7b0JBRXRDQSxpQkFBbUJBLHdCQUFpQkEsRUFBQ0EsMkRBQW9DQSw2QkFBY0E7b0JBQ3ZGQSxJQUFJQTt3QkFDQUEsT0FBT0E7O29CQUNYQSxPQUFPQTs7MENBR2tCQSxPQUFjQTs7b0JBRXZDQSxrQkFBcUJBLHdCQUFpQkEsNkJBQWNBO29CQUNwREEsSUFBSUE7d0JBQ0FBLE9BQU9BOztvQkFDWEEsT0FBT0E7O3VDQUdjQSxPQUFhQSxPQUFjQTtvQkFFaERBLFlBQWNBLFlBQVlBLE9BQU9BO29CQUNqQ0EsSUFBSUEscUJBQWVBO3dCQUNmQSxPQUFPQTs7O29CQUVYQSxVQUFRQSxvQkFBY0E7b0JBQ3RCQSxPQUFPQTs7a0RBR3VCQTtvQkFFOUJBLElBQUlBO3dCQUNBQSxPQUFPQTs7O29CQUVYQSxLQUFLQSxXQUFXQSxJQUFJQSw4QkFBb0JBO3dCQUVwQ0EsSUFBSUEsc0JBQWFBOzRCQUNiQSxPQUFPQTs7OztvQkFHZkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0FsTG9EQSxBQUF5REEsVUFBQ0E7d0JBQU9BLFFBQVFBLElBQUlBLG9FQUFzQkEsaUVBQWdDQSxVQUFDQSxHQUFFQTttQ0FBTUE7O3dCQUFPQSxPQUFPQTtzQkFBNUhBLEtBQUlBO3lDQUVqQ0EsQUFBeURBLFVBQUNBO3dCQUFPQSxRQUFRQSxJQUFJQSxvRUFBc0JBLGlFQUFnQ0EsVUFBQ0EsR0FBRUE7bUNBQU1BOzt3QkFBT0EsT0FBT0E7c0JBQTVIQSxLQUFJQTt1Q0FHbENBLEFBQTJEQSxVQUFDQTt3QkFBT0EsUUFBUUEsSUFBSUEseUVBQTJCQSxJQUFJQTt3QkFBbUJBLFFBQVFBLElBQUlBLHNFQUF3QkEsSUFBSUE7d0JBQW1CQSxRQUFRQSxJQUFJQSxzRUFBd0JBLElBQUlBO3dCQUFtQkEsUUFBUUEsSUFBSUEsc0VBQXdCQSxJQUFJQTt3QkFBbUJBLFFBQVFBLElBQUlBLHNFQUF3QkEsSUFBSUE7d0JBQW1CQSxPQUFPQTtzQkFBdFZBLEtBQUlBO3FDQUdwQ0EsQUFBMkRBLFVBQUNBO3dCQUFPQSxRQUFRQSxJQUFJQSxnRkFBa0NBLElBQUlBO3dCQUFvQ0EsUUFBUUEsSUFBSUEsZ0ZBQWtDQSxJQUFJQTt3QkFBb0NBLE9BQU9BO3NCQUF4TkEsS0FBSUE7b0NBR3JDQSxBQUF5REEsVUFBQ0E7d0JBQU9BLFFBQVFBLElBQUlBLGdHQUFpREEsMERBQXlCQSxVQUFDQSxRQUFRQTttQ0FBVUEsNERBQWNBOzt3QkFBd0JBLFFBQVFBLElBQUlBLDRIQUE4RUEsMERBQXlCQSxVQUFDQSxRQUFRQTttQ0FBVUEsNERBQWNBOzt3QkFBa0NBLFFBQVFBLElBQUlBLHVIQUF5RUEsMERBQXlCQSxVQUFDQSxRQUFRQTttQ0FBVUEsNERBQWNBOzt3QkFBa0NBLFFBQVFBLElBQUlBLDBIQUE0RUEsMERBQXlCQSxVQUFDQSxRQUFRQTttQ0FBVUEsNkRBQWVBOzt3QkFBbUJBLFFBQVFBLElBQUlBLHFIQUF1RUEsMERBQXlCQSxVQUFDQSxRQUFRQTttQ0FBVUEsNkRBQWVBOzt3QkFBbUJBLFFBQVFBLElBQUlBLDhFQUFnQ0EsK0RBQThCQSxVQUFDQSxRQUFRQTttQ0FBVUEsSUFBSUEscURBQW9CQSxnQkFBZ0JBOzt3QkFBU0EsT0FBT0E7c0JBQXIvQkEsS0FBSUE7c0NBRXhDQSxBQUFpREEsVUFBQ0E7d0JBQU9BO3dCQUFnQkEsT0FBT0E7c0JBQWxEQSxLQUFJQTs7MkNBVXBEQSxJQUFJQTtvQ0FFR0EsS0FBSUE7OzRCQUVuQkE7O2dCQUVoQkEsZUFBZUE7Ozs7O2dCQUtmQSxjQUF1QkE7Z0JBQ3ZCQSxpQkFBWUEsSUFBSUEsMENBQU1BLCtCQUFzQkEsZUFBbUJBLDRDQUFnQ0EsQUFBZ0RBO21DQUFLQTsyQ0FBZ0JBO2dCQUNwS0Esa0JBQWFBLElBQUlBLDBDQUFNQSwrQkFBc0JBLGVBQW1CQSw2Q0FBaUNBLEFBQWtEQTttQ0FBS0E7MkNBQWdCQTtnQkFDeEtBLGlCQUFZQSxJQUFJQSwwQ0FBTUEsK0JBQXNCQSxlQUFtQkEsK0NBQW1DQSxBQUFrREE7bUNBQUtBOzJDQUFnQkE7Z0JBQ3pLQSxxQkFBZ0JBLElBQUlBLDBDQUFNQSwrQkFBc0JBLGVBQW1CQSxnREFBb0NBLEFBQWdEQTttQ0FBS0E7MkNBQWVBO2dCQUMzS0Esc0JBQWlCQSxJQUFJQSwwQ0FBTUEsK0JBQXNCQSxlQUFtQkEsaURBQXFDQSxBQUFnREE7bUNBQUtBOzJDQUFlQTtnQkFDN0tBLG1CQUFjQSxJQUFJQSwwQ0FBTUEsK0JBQXNCQSxlQUFtQkEsb0NBQWtCQTs7b0NBRzFDQTs7Ozs7Ozs7Ozs7Ozs7d0NBRXpDQSxJQUFJQTtnREFDQUE7Ozs0Q0FFSkE7NENBQ0FBOzRDQUNBQTs0Q0FDQUEsdUJBQWtCQTs7NENBRWxCQTs7Ozs7NkNBQU1BOzs7Ozs7Ozt3Q0FFRkEsOEJBQXlCQSxZQUFnQkE7OzRDQUV6Q0EsU0FBcUJBOzRDQUNyQkEsUUFBUUE7Z0RBRUpBLEtBQUtBO29EQUF1Q0EsU0FBU0EsbUNBQThCQSxZQUFnQkE7b0RBQVFBO2dEQUMzR0EsS0FBS0E7b0RBQTBDQSxTQUFTQSxnQ0FBMkJBLFlBQWdCQTtvREFBUUE7Z0RBQzNHQSxLQUFLQTtvREFBa0NBLFNBQVNBLDhCQUF5QkEsWUFBZ0JBO29EQUFRQTs7OzRDQUdyR0EsSUFBSUEsVUFBVUE7Ozs7Ozs7O3dDQUNWQSxzQkFBYUE7Ozs7Ozs7Ozs7Ozs7O3dDQUdyQkEsOEJBQXlCQSxZQUFnQkE7NENBQ3pDQSxJQUFJQSxVQUFRQTtnREFDUkEsTUFBTUEsSUFBSUEsaUJBQVVBLGdFQUF1REEsa0JBQXFCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7cURBRzlEQSxZQUFtQkEsT0FBZUE7O2dCQUV4RUE7Z0JBQ0FBLElBQUlBLENBQUNBLFNBQVFBLDBEQUFZQSxvQkFBZUEsWUFBZ0JBO29CQUVwREEsdUJBQWtCQTtvQkFDbEJBLE9BQU9BLDhCQUFpQkEsdUVBQXVCQSwwQkFBb0JBLE1BQU1BOzs7Z0JBRzdFQSxJQUFJQSxDQUFDQSxTQUFRQSwwREFBWUEsaUJBQVlBLFlBQWdCQTtvQkFFakRBLHVCQUFrQkE7b0JBQ2xCQSxPQUFPQSwyQkFBY0EsdUVBQXVCQTs7O2dCQUdoREEsSUFBSUEsQ0FBQ0EsU0FBUUEsMERBQVlBLGdCQUFXQSxZQUFnQkE7b0JBRWhEQSx1QkFBa0JBO29CQUNsQkEsT0FBT0EsMEJBQWFBLHVFQUF1QkEsMEJBQW9CQSxNQUFNQTs7O2dCQUd6RUEsSUFBSUEsZ0JBQWdCQSxDQUFDQSxTQUFRQSwwREFBWUEscUJBQWdCQSxZQUFnQkE7b0JBRXJFQSx1QkFBa0JBO29CQUNsQkEsT0FBT0EsK0JBQWtCQSx1RUFBdUJBLDBCQUFvQkEsTUFBTUE7OztnQkFHOUVBLE9BQU9BOztrREFHNEJBLFlBQW1CQTtnQkFFdERBLGFBQXFCQSxtQ0FBOEJBLFlBQWdCQTtnQkFDbkVBLElBQUlBLFVBQVVBO29CQUNWQSxNQUFNQSxJQUFJQSxpQkFBVUEsMkNBQXFCQSwrQkFBMEJBLFlBQVlBOztnQkFDbkZBLE9BQU9BOztnREFHMEJBLFlBQW1CQSxPQUFlQTs7Z0JBRW5FQTtnQkFDQUEsSUFBSUEsQ0FBQ0EsU0FBUUEsMERBQVlBLGdCQUFXQSxZQUFnQkE7b0JBRWhEQSx1QkFBa0JBO29CQUNsQkEsT0FBT0EsNkJBQWdCQSx1RUFBdUJBOzs7Z0JBR2xEQSxJQUFJQSxnQkFBZ0JBLENBQUNBLFNBQVFBLDBEQUFZQSxxQkFBZ0JBLFlBQWdCQTtvQkFFckVBLHVCQUFrQkE7b0JBQ2xCQSxPQUFPQSwrQkFBa0JBLHVFQUF1QkEsMEJBQW9CQSxNQUFNQTs7O2dCQUc5RUEsT0FBT0E7O2dEQUVXQSxZQUFtQkE7Z0JBRTdDQSwwREFBWUEsa0JBQWFBLFlBQWdCQTs7Ozs7Ozs7Ozs7Ozs0QkFxRVhBLFNBQWdCQSxNQUFzQkE7O2dCQUV4REEsZUFBZUE7Z0JBQ2ZBLGFBQWFBO2dCQUNiQSxZQUFZQTs7OzsrQkFFV0EsUUFBcUJBO2dCQUU1Q0EsYUFBZ0JBLFdBQU1BLFFBQVFBO2dCQUM5Q0E7Z0JBQWtDQSxPQUFPQSxDQUFDQSxTQUFRQSxxRUFBMEJBLE9BQU1BLFFBQVFBLElBQUlBLDZDQUFZQSxXQUFNQTs7Ozs7Ozs7Ozs7OzRCQXhCNUVBLFNBQWdCQTs7Z0JBRXBDQSxlQUFlQTtnQkFDZkEsaUJBQWlCQTs7Ozs7Z0JBSTdCQSxPQUFPQSxJQUFJQSw2Q0FBWUEsNERBQTJCQSxzQkFBeUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQzdLdkRBO3dCQUNFQTs7Ozs7b0JBYmxCQSxPQUFPQSwrQkFBeUJBLDBGQUFtQ0Esd0NBQTJCQTs7Ozs7b0JBS3RGQSxJQUFJQTt3QkFDQUEsT0FBT0E7O3dCQUVQQSxNQUFNQSxJQUFJQTs7Ozs7OztrQ0FkNkJBLEtBQUlBOzs7NEJBcUJwQ0EsSUFBUUEsUUFBb0JBOztnQkFFM0NBLGlCQUFpQkE7Z0JBQ2pCQSxjQUFjQTtnQkFDZEEsZ0JBQWdCQTs7Ozs7Z0JBS2hCQTs7O2dCQUtBQTtnQkFDQUEsS0FBS0EsV0FBV0EsSUFBSUEsdUJBQWtCQTtvQkFFbENBLGNBQVNBLHdCQUFXQSxXQUFXQTs7Z0JBRW5DQTs7O2dCQUtBQSxJQUFJQSxtQkFBY0E7b0JBRWRBLEtBQUlBLFdBQVdBLElBQUlBLHVCQUFrQkE7d0JBRWpDQSxrQkFBYUEsd0JBQVdBLHFCQUFxQkE7Ozs7Z0JBSXJEQSxPQUFPQTs7O2dCQUtQQTtnQkFDQUEsS0FBSUEsV0FBV0EsSUFBSUEsdUJBQWtCQTtvQkFFakNBLHFCQUFPQSx5QkFBV0E7O2dCQUV0QkE7Z0JBQ0FBLE9BQU9BOzs7Ozs7Ozs7Ozs0QkM3RFFBLE1BQXNCQTs7Z0JBRXJDQSxZQUFZQTtnQkFDWkEsYUFBYUE7Ozs7O2dCQUlyQkEsT0FBT0Esa0RBQTBDQSxtSkFBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lDTDlDQSw0QkFBWUE7WUFDWkEsa0NBQWtCQTs7WUFFbEJBLDBDQUEwQkE7O1lBRTFCQSxrQ0FBa0JBOzs7Ozs7Ozs7OzZDQXFCZUE7b0JBRWpDQTt3QkFFSUEsV0FBa0JBLElBQUlBLG1EQUFXQTt3QkFDakNBO3dCQUNBQSxzQ0FBc0JBOzs7d0JBR3RCQSxzQ0FBc0JBLCtDQUFzQ0E7Ozs7Ozs7Ozs7dUNDMUNuQ0E7O29CQUU3QkEsV0FBY0Esc0VBQTZEQTtvQkFDM0VBOztvQkFHQUE7b0JBQ0FBO29CQUNBQTtvQkFDQUE7b0JBQ0FBO29CQUNBQTtvQkFDQUE7b0JBQ0FBOztvQkFHQUE7O29CQUVBQSwwQkFBcUJBOzs7OzRCQUVqQkE7NEJBQ0FBLGVBQWdCQTs0QkFDaEJBLGtCQUFxQkE7NEJBQ3JCQSwyQkFBeUJBOzs7O29DQUVyQkE7b0NBQ0FBLElBQUlBO3dDQUVBQSx1QkFBUUEscURBQTRDQSw4REFBMkJBOzs7b0NBRW5GQSxtQkFBb0JBLDRCQUE0QkE7b0NBQ2hEQSxjQUFjQSxrQkFBa0JBOztvQ0FHaENBLHVCQUFRQSx5Q0FBZ0NBLDBEQUF5QkEsQ0FBQ0EsdUJBQXVCQSxPQUFPQSwwQkFBTUE7O29DQUd0R0EsdUJBQVFBLDRDQUFtQ0EsMkNBQWdCQTs7b0NBRzNEQSx1QkFBUUEsaUZBQXdFQSwwREFBeUJBLFFBQUNBLFlBQVVBLE9BQUtBLDBDQUFjQSxBQUFRQSxxQkFBdENBLGVBQXNEQSxDQUFDQSx1QkFBdUJBLE9BQU9BLE9BQU1BLHlFQUF1Q0E7O29DQUUzT0E7b0NBQ0FBO29DQUNBQSxXQUFXQTs7Ozs7Ozs7NEJBR2ZBLHVCQUFRQSx5R0FBZ0dBLDJDQUFnQkEsdURBQTRCQSxRQUFDQSxPQUFvQ0Esc0JBQW9CQSxPQUFLQSxxREFBOERBLEFBQVFBLHFCQUFwSUE7OzRCQUVwSkE7Ozs7Ozs7O29CQUdKQTtvQkFDQUE7b0JBQ0FBLE9BQU9BOzs7Ozs7Ozs7Ozs7NEJDdkRKQTs7O2dCQUVYQSxhQUFhQTs7Ozs7Z0JBR2JBLE9BQU9BOzs7Z0JBR1BBLE9BQU9BOzs7Z0JBR1BBLE9BQU9BLDZCQUFvQkE7Ozs7Ozs7Ozs7OzRCQ1hEQTs7O2dCQUVsQkEsYUFBYUE7Ozs7O2dCQUlyQkEsT0FBT0E7OztnQkFHUEEsT0FBT0E7OztnQkFHUEEsT0FBT0EsOEJBQXFCQTs7Ozs7Ozs7Ozs7Ozs0QkNWUkEsU0FBdUJBOzs7O2dCQUVuQ0EsZUFBZUE7Z0JBQ2ZBLG9CQUFvQkE7Z0JBQ3BCQSxvQkFBZUEsTUFBb0NBLHNCQUFhQSxPQUFLQSxxQkFBeURBLEFBQU1BOzs7OztnQkFJcElBLGtCQUFlQTtnQkFDZkEsSUFBSUEsb0JBQUNBLGdCQUFTQSxPQUFLQSxtQ0FBOEJBLG1CQUFrQkEsU0FBT0EsQUFBT0E7b0JBQzdFQSxPQUFPQTs7b0JBRVBBLE9BQU9BOzs7O2dCQUtuQkEsT0FBT0E7OztnQkFHUEEsT0FBT0E7Ozs7Ozs7Ozs7OytCQ3RCb0JBO2dCQUUzQkEsT0FBT0EsVUFBS0EsUUFBUUE7OztnQkFHcEJBLE9BQU9BOzt5Q0FFb0NBO2dCQUVuQ0EsSUFBSUEsMkNBQXNCQSxBQUFPQSxrQkFBV0EsMkNBQWlCQSxBQUFPQTtvQkFFaEVBLFlBQU9BLDZFQUF5QkEsQUFBT0E7b0JBQ3ZDQSxPQUFPQSxBQUFPQTt1QkFFYkEsSUFBSUEsMkNBQXNCQSxBQUFPQSxrQkFBVUEsMkNBQWlCQSxBQUFPQTtvQkFFcEVBLFlBQU9BLDZFQUF5QkEsQUFBT0E7b0JBQ3ZDQSxPQUFPQSxBQUFPQTt1QkFFYkEsSUFBSUEsMkNBQXNCQSxBQUFPQSxpQkFBUUEsMkNBQWlCQSxBQUFPQTtvQkFFbEVBLFlBQU9BLDZFQUF5QkEsQUFBT0E7b0JBQ3ZDQSxPQUFPQSxBQUFPQTs7b0JBR2RBLE1BQU1BLElBQUlBOzs7OztnQkFJdEJBLE9BQU9BLGdDQUF1QkEsTUFBb0NBLG1CQUFZQSxPQUFLQSxzQkFBd0VBLEFBQVFBOzs7Ozs7Ozs7OzsrQkM3QnhJQTtnQkFFM0JBLE9BQU9BLFVBQUtBLFFBQVFBOzs7Z0JBR3BCQSxPQUFPQTs7eUNBRW9DQTtnQkFFbkNBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVdBLDJDQUFpQkEsQUFBT0E7b0JBRWhFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7dUJBRWJBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVVBLDJDQUFpQkEsQUFBT0E7b0JBRXBFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7dUJBRWJBLElBQUlBLDJDQUFzQkEsQUFBT0EsaUJBQVFBLDJDQUFpQkEsQUFBT0E7b0JBRWxFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7O29CQUdkQSxNQUFNQSxJQUFJQTs7Ozs7Z0JBSXRCQSxPQUFPQSxnQ0FBdUJBLE1BQW9DQSxtQkFBWUEsT0FBS0Esc0JBQXdFQSxBQUFRQTs7Ozs7Ozs7Ozs7K0JDN0J4SUE7Z0JBRTNCQSxPQUFPQSxVQUFLQSxRQUFRQTs7O2dCQUdwQkEsT0FBT0E7O3lDQUVvQ0E7Z0JBRW5DQSxJQUFJQSwyQ0FBc0JBLEFBQU9BLGtCQUFXQSwyQ0FBaUJBLEFBQU9BO29CQUVoRUEsWUFBT0EsNkVBQXlCQSxBQUFPQTtvQkFDdkNBLE9BQU9BLEFBQU9BO3VCQUViQSxJQUFJQSwyQ0FBc0JBLEFBQU9BLGtCQUFVQSwyQ0FBaUJBLEFBQU9BO29CQUVwRUEsWUFBT0EsNkVBQXlCQSxBQUFPQTtvQkFDdkNBLE9BQU9BLEFBQU9BO3VCQUViQSxJQUFJQSwyQ0FBc0JBLEFBQU9BLGlCQUFRQSwyQ0FBaUJBLEFBQU9BO29CQUVsRUEsWUFBT0EsNkVBQXlCQSxBQUFPQTtvQkFDdkNBLE9BQU9BLEFBQU9BOztvQkFHZEEsTUFBTUEsSUFBSUE7Ozs7O2dCQUl0QkEsT0FBT0EsZ0NBQXVCQSxNQUFvQ0EsbUJBQVlBLE9BQUtBLHNCQUF3RUEsQUFBUUE7Ozs7Ozs7OytCQzFCeElBO2dCQUUzQkEsT0FBT0Esb0JBQVNBLHdCQUFpQkEsU0FBU0Esd0JBQWlCQTs7O2dCQUczREEsT0FBT0E7O3lDQUM2QkE7Z0JBRXBDQSxPQUFPQSxBQUFPQTs7O2dCQU1kQTs7OztnQkFHQUEsT0FBT0EsbUNBQTBCQSxNQUFvQ0EsbUJBQVlBLE9BQUtBLHNCQUF3RUEsQUFBUUE7Ozs7Ozs7Ozs7OytCQ3BCM0lBO2dCQUUzQkEsT0FBT0EsVUFBS0EsUUFBUUE7OztnQkFHcEJBLE9BQU9BOzt5Q0FFb0NBO2dCQUVuQ0EsSUFBSUEsMkNBQXNCQSxBQUFPQSxrQkFBV0EsMkNBQWlCQSxBQUFPQTtvQkFFaEVBLFlBQU9BLGtGQUE4QkEsQUFBT0E7b0JBQzVDQSxPQUFPQSxBQUFPQTt1QkFFYkEsSUFBSUEsMkNBQXNCQSxBQUFPQSxrQkFBVUEsMkNBQWlCQSxBQUFPQTtvQkFFcEVBLFlBQU9BLGtGQUE4QkEsQUFBT0E7b0JBQzVDQSxPQUFPQSxBQUFPQTs7b0JBSWRBLFlBQU9BLGtGQUE4QkEsQUFBT0E7b0JBQzVDQSxPQUFPQSxBQUFPQTs7OztnQkFLMUJBLE9BQU9BLGtDQUF5QkEsQ0FBQ0Esa0JBQWFBLE9BQU9BOzs7Ozs7Ozs7OzsrQkMzQjFCQTtnQkFFM0JBLE9BQU9BLFVBQUtBLFFBQVFBOzs7Z0JBR3BCQSxPQUFPQTs7eUNBRW9DQTtnQkFFbkNBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVdBLDJDQUFpQkEsQUFBT0E7b0JBRWhFQSxZQUFPQSxrRkFBOEJBLEFBQU9BO29CQUM1Q0EsT0FBT0EsQUFBT0E7dUJBRWJBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVVBLDJDQUFpQkEsQUFBT0E7b0JBRXBFQSxZQUFPQSxrRkFBOEJBLEFBQU9BO29CQUM1Q0EsT0FBT0EsQUFBT0E7O29CQUlkQSxZQUFPQSxrRkFBOEJBLEFBQU9BO29CQUM1Q0EsT0FBT0EsQUFBT0E7Ozs7Z0JBSzFCQSxPQUFPQTs7Ozs7Ozs7K0JDNUJvQkE7Z0JBRTNCQSxPQUFPQTs7O2dCQUdQQSxPQUFPQTs7eUNBQzZCQTtnQkFFcENBLE9BQU9BOzs7Z0JBR1BBOzs7O2dCQUdBQSxPQUFPQSw4QkFBcUJBLE1BQW9DQSxtQkFBWUEsT0FBS0Esc0JBQXdFQSxBQUFRQTs7Ozs7Ozs7Ozs7K0JDVHRJQTtnQkFFM0JBLE9BQU9BLFVBQUtBLFFBQVFBOzs7Z0JBR3BCQSxPQUFPQTs7eUNBRW9DQTtnQkFFbkNBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVdBLDJDQUFpQkEsQUFBT0E7b0JBRWhFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7dUJBRWJBLElBQUlBLDJDQUFzQkEsQUFBT0Esa0JBQVVBLDJDQUFpQkEsQUFBT0E7b0JBRXBFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7dUJBRWJBLElBQUlBLDJDQUFzQkEsQUFBT0EsaUJBQVFBLDJDQUFpQkEsQUFBT0E7b0JBRWxFQSxZQUFPQSw2RUFBeUJBLEFBQU9BO29CQUN2Q0EsT0FBT0EsQUFBT0E7O29CQUdkQSxNQUFNQSxJQUFJQTs7Ozs7Z0JBSXRCQSxPQUFPQSxnQ0FBdUJBLE1BQW9DQSxtQkFBWUEsT0FBS0Esc0JBQXdFQSxBQUFRQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgc3RhdGljIGNsYXNzIERlYnVnRXh0ZW5zaW9uXHJcbiAgICB7XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyB2b2lkIFByaW50RGVidWcodGhpcyBSdXN0aWNFeHByIGV4cHJlc3Npb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFJ1c3RpY1N0YWNrPiBzdGFja3MgPSBleHByZXNzaW9uLnN0YWNrcztcclxuICAgICAgICAgICAgZm9yIChpbnQgciA9IHN0YWNrcy5Db3VudCAtIDE7IHIgPj0gMDsgci0tKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBcInI5OVtwPTk5XTogIFwiXHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiUnswfSBbUD17MX1dOlwiLHIsc3RhY2tzW3JdLnByaW9yaXR5KS5QYWRSaWdodCgzMCkgKyBzdGFja3Nbcl0uVG9FeHByZXNzaW9uU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrc1tyXS5vcGVyYXRpb25zLkNvdW50ID09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIk5vIG9wZXJhdGlvbnMgZm91bmQuXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBUeXBlIHByZXZUeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IHN0YWNrc1tyXS5vcGVyYXRpb25zLkNvdW50OyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBSdXN0aWNPcGVyYXRpb24gb3BlcmF0aW9uID0gc3RhY2tzW3JdLm9wZXJhdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCIgIHswfSBSWHsxfVwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwob3BlcmF0aW9uLnBhcmFtZXRlciA9PSBudWxsID8gXCJcIiA6IFwiLCBcIiArIG9wZXJhdGlvbi5wYXJhbWV0ZXIpKS5QYWRSaWdodCgzMCkgKyBzdHJpbmcuRm9ybWF0KFwiICAjIHswfSh7MX0sIHsyfSk6IHszfVwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwocHJldlR5cGUhPW51bGw/cHJldlR5cGUuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiLChnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLG9wZXJhdGlvbi5wYXJhbWV0ZXJUeXBlKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8VHlwZT4oXCJrZXkxXCIpLk5hbWU6KHN0cmluZyludWxsKSA/PyBcIm51bGxcIixvcGVyYXRpb24uUHJldmlld1Jlc3VsdFR5cGUocHJldlR5cGUpLk5hbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldlR5cGUgPSBvcGVyYXRpb24uUHJldmlld1Jlc3VsdFR5cGUocHJldlR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2tzW3JdLmV4ZWN1dGVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCIgIFJlc3VsdFZhbHVlIHswfVwiLHN0YWNrc1tyXS5SZXN1bHRWYWx1ZSkuUGFkUmlnaHQoMzApICsgc3RyaW5nLkZvcm1hdChcIiAgIyB7MH1cIiwoZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTJcIixzdGFja3Nbcl0uUmVzdWx0VmFsdWUpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxvYmplY3Q+KFwia2V5MlwiKS5HZXRUeXBlKCkuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxue1xuICAgIGFic3RyYWN0IGNsYXNzIFJ1c3RpY1ZhbHVlRXZhbHVhdG9yXG4gICAge1xuICAgICAgICBhYnN0cmFjdCBwdWJsaWMgb2JqZWN0IEdldFZhbHVlKCk7XG4gICAgICAgIGFic3RyYWN0IHB1YmxpYyBUeXBlIEdldFZhbHVlVHlwZSgpO1xucHVibGljIFQgR2V0VmFsdWU8VD4oKVxyXG57XHJcbiAgICByZXR1cm4gKFQpR2V0VmFsdWUoKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgYWJzdHJhY3QgY2xhc3MgUnVzdGljT3BlcmF0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFJ1c3RpY1ZhbHVlRXZhbHVhdG9yIHBhcmFtZXRlciB7IGdldDsgc2V0OyB9XHJcbnB1YmxpYyBvYmplY3QgcGFyYW1ldGVyVmFsdWVcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtZXRlci5HZXRWYWx1ZSgpO1xyXG4gICAgfVxyXG59cHVibGljIFR5cGUgcGFyYW1ldGVyVHlwZVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLkdldFZhbHVlVHlwZSgpOihUeXBlKW51bGw7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBpbnQgcHJpb3JpdHlPZmZzZXQ7XHJcbiAgICAgICAgYWJzdHJhY3QgcHVibGljIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpO1xyXG4gICAgICAgIGFic3RyYWN0IHB1YmxpYyBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKTtcclxuICAgICAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKTtcclxucHVibGljIGludCBHZXRQcmlvcml0eVdpdGhPZmZzZXQoKVxyXG57XHJcbiAgICByZXR1cm4gKGludClHZXRQcmlvcml0eSgpICsgcHJpb3JpdHlPZmZzZXQ7XHJcbn1wdWJsaWMgYm9vbCBIYXNJbmNyZWFzZWRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiAocGFyYW1ldGVyICE9IG51bGwpICYmIChwYXJhbWV0ZXIgaXMgRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZSk7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCJ7MH17MX1cIixHZXRUeXBlKCkuTmFtZSwocGFyYW1ldGVyICE9IG51bGwgPyBwYXJhbWV0ZXIuR2V0VHlwZSgpLk5hbWUgOiBcIlwiKSk7XHJcbn1wdWJsaWMgdmlydHVhbCBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgezB9ezF9XCIsR2V0VHlwZSgpLk5hbWUsKHBhcmFtZXRlciAhPSBudWxsID8gXCIgXCIgKyBwYXJhbWV0ZXJWYWx1ZSA6IFwiXCIpKTtcclxufXB1YmxpYyB2aXJ0dWFsIGJvb2wgSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKClcclxue1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbiAgICAgICAgcHVibGljIGNvbnN0IGludCBGaXJzdFByaW9yaXR5ID0gMTsgLy8gVGhpcyBpcyB0aGUgdmFsdWUgb2YgdGhlIGxvd2VyIHByaW9yaXR5IG9wZXJhdGlvbiAoZXhjZXB0IHRob3NlIHRoYXQgZG9lc24ndCBoYXZlIHByaW9yaXR5IGFuZCBhcmUgc2V0IHRvIC05OTk5OTkgb3Igc29tZXRoaW5nIGxpa2UgdGhhdCkuXHJcbiAgICAgICAgcHVibGljIGVudW0gUHJpb3JpdHlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIElnbm9yZWQgPSAtOTk5OTk5LFxyXG4gICAgICAgICAgICBBZGRTdWIgPSAxLFxyXG4gICAgICAgICAgICBNdWxEaXYgPSAyLFxyXG4gICAgICAgICAgICBQb3cgPSAzLFxyXG4gICAgICAgICAgICBQcmVmaXhVbmFyeSA9IDQsXHJcblxyXG4gICAgICAgICAgICBQYXJlbnRoZXNpcyA9IDIwLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uT3BlcmF0aW9ucy5Qcm92aWRlcnNcclxue1xyXG4gICAgc3RhdGljIGNsYXNzIENvbW1vbk1hdGhcclxuICAgIHtcclxuICAgICAgICBzdGF0aWMgcHVibGljIERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4gTmVnYXRpdmUgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PigpLChfbzEpPT57X28xLkFkZCh0eXBlb2YoZmxvYXQpLE5lZ2F0aXZlU2luZ2xlKTtfbzEuQWRkKHR5cGVvZihkb3VibGUpLE5lZ2F0aXZlRG91YmxlKTtfbzEuQWRkKHR5cGVvZihpbnQpLE5lZ2F0aXZlSW50MzIpO3JldHVybiBfbzE7fSk7XHJcbnN0YXRpYyBvYmplY3QgTmVnYXRpdmVTaW5nbGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gLUNvbnZlcnQuVG9TaW5nbGUoYSk7XHJcbn1zdGF0aWMgb2JqZWN0IE5lZ2F0aXZlRG91YmxlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIC1Db252ZXJ0LlRvRG91YmxlKGEpO1xyXG59c3RhdGljIG9iamVjdCBOZWdhdGl2ZUludDMyKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIC1Db252ZXJ0LlRvSW50MzIoYSk7XHJcbn1cclxuICAgICAgICBzdGF0aWMgcHVibGljIERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4gUG9zaXRpdmUgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgRGljdGlvbmFyeTxUeXBlLCBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+PigpLChfbzIpPT57X28yLkFkZCh0eXBlb2YoZmxvYXQpLFBvc2l0aXZlU2luZ2xlKTtfbzIuQWRkKHR5cGVvZihkb3VibGUpLFBvc2l0aXZlRG91YmxlKTtfbzIuQWRkKHR5cGVvZihpbnQpLFBvc2l0aXZlSW50MzIpO3JldHVybiBfbzI7fSk7XHJcbnN0YXRpYyBvYmplY3QgUG9zaXRpdmVTaW5nbGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub1NpbmdsZShhKTtcclxufXN0YXRpYyBvYmplY3QgUG9zaXRpdmVEb3VibGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0RvdWJsZShhKTtcclxufXN0YXRpYyBvYmplY3QgUG9zaXRpdmVJbnQzMihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoYSk7XHJcbn1cclxuICAgICAgICBzdGF0aWMgcHVibGljIERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4gQWRkID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4oKSwoX28zKT0+e19vMy5BZGQodHlwZW9mKGZsb2F0KSxBZGRTaW5nbGUpO19vMy5BZGQodHlwZW9mKGRvdWJsZSksQWRkRG91YmxlKTtfbzMuQWRkKHR5cGVvZihpbnQpLEFkZEludDMyKTtyZXR1cm4gX28zO30pO1xyXG5zdGF0aWMgb2JqZWN0IEFkZFNpbmdsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvU2luZ2xlKGEpICsgQ29udmVydC5Ub1NpbmdsZShiKTtcclxufXN0YXRpYyBvYmplY3QgQWRkRG91YmxlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9Eb3VibGUoYSkgKyBDb252ZXJ0LlRvRG91YmxlKGIpO1xyXG59c3RhdGljIG9iamVjdCBBZGRJbnQzMihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoYSkgKyBDb252ZXJ0LlRvSW50MzIoYik7XHJcbn1cclxuICAgICAgICBzdGF0aWMgcHVibGljIERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4gU3ViID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4oKSwoX280KT0+e19vNC5BZGQodHlwZW9mKGZsb2F0KSxTdWJTaW5nbGUpO19vNC5BZGQodHlwZW9mKGRvdWJsZSksU3ViRG91YmxlKTtfbzQuQWRkKHR5cGVvZihpbnQpLFN1YkludDMyKTtyZXR1cm4gX280O30pO1xyXG5zdGF0aWMgb2JqZWN0IFN1YlNpbmdsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvU2luZ2xlKGEpIC0gQ29udmVydC5Ub1NpbmdsZShiKTtcclxufXN0YXRpYyBvYmplY3QgU3ViRG91YmxlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9Eb3VibGUoYSkgLSBDb252ZXJ0LlRvRG91YmxlKGIpO1xyXG59c3RhdGljIG9iamVjdCBTdWJJbnQzMihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoYSkgLSBDb252ZXJ0LlRvSW50MzIoYik7XHJcbn1cclxuICAgICAgICBzdGF0aWMgcHVibGljIERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4gTXVsID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4oKSwoX281KT0+e19vNS5BZGQodHlwZW9mKGZsb2F0KSxNdWxTaW5nbGUpO19vNS5BZGQodHlwZW9mKGRvdWJsZSksTXVsRG91YmxlKTtfbzUuQWRkKHR5cGVvZihpbnQpLE11bEludDMyKTtyZXR1cm4gX281O30pO1xyXG5zdGF0aWMgb2JqZWN0IE11bFNpbmdsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvU2luZ2xlKGEpICogQ29udmVydC5Ub1NpbmdsZShiKTtcclxufXN0YXRpYyBvYmplY3QgTXVsRG91YmxlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9Eb3VibGUoYSkgKiBDb252ZXJ0LlRvRG91YmxlKGIpO1xyXG59c3RhdGljIG9iamVjdCBNdWxJbnQzMihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoYSkgKiBDb252ZXJ0LlRvSW50MzIoYik7XHJcbn1cclxuICAgICAgICBzdGF0aWMgcHVibGljIERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4gRGl2ID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IERpY3Rpb25hcnk8VHlwZSwgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0Pj4oKSwoX282KT0+e19vNi5BZGQodHlwZW9mKGZsb2F0KSxEaXZTaW5nbGUpO19vNi5BZGQodHlwZW9mKGRvdWJsZSksRGl2RG91YmxlKTtfbzYuQWRkKHR5cGVvZihpbnQpLERpdkludDMyKTtyZXR1cm4gX282O30pO1xyXG5zdGF0aWMgb2JqZWN0IERpdlNpbmdsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvU2luZ2xlKGEpIC8gQ29udmVydC5Ub1NpbmdsZShiKTtcclxufXN0YXRpYyBvYmplY3QgRGl2RG91YmxlKG9iamVjdCBhLCBvYmplY3QgYilcclxue1xyXG4gICAgcmV0dXJuIENvbnZlcnQuVG9Eb3VibGUoYSkgLyBDb252ZXJ0LlRvRG91YmxlKGIpO1xyXG59c3RhdGljIG9iamVjdCBEaXZJbnQzMihvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvSW50MzIoYSkgLyBDb252ZXJ0LlRvSW50MzIoYik7XHJcbn1zdGF0aWMgcHVibGljIG9iamVjdCBJbnREaXYob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGEpIC8gQ29udmVydC5Ub0ludDMyKGIpO1xyXG59XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+IE1vZCA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFR5cGUsIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4+KCksKF9vNyk9PntfbzcuQWRkKHR5cGVvZihmbG9hdCksTW9kU2luZ2xlKTtfbzcuQWRkKHR5cGVvZihkb3VibGUpLE1vZERvdWJsZSk7X283LkFkZCh0eXBlb2YoaW50KSxNb2RJbnQzMik7cmV0dXJuIF9vNzt9KTtcclxuc3RhdGljIG9iamVjdCBNb2RTaW5nbGUob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub1NpbmdsZShhKSAlIENvbnZlcnQuVG9TaW5nbGUoYik7XHJcbn1zdGF0aWMgb2JqZWN0IE1vZERvdWJsZShvYmplY3QgYSwgb2JqZWN0IGIpXHJcbntcclxuICAgIHJldHVybiBDb252ZXJ0LlRvRG91YmxlKGEpICUgQ29udmVydC5Ub0RvdWJsZShiKTtcclxufXN0YXRpYyBvYmplY3QgTW9kSW50MzIob2JqZWN0IGEsIG9iamVjdCBiKVxyXG57XHJcbiAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGEpICUgQ29udmVydC5Ub0ludDMyKGIpO1xyXG59ICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxyXG57XHJcbiAgICBjbGFzcyBSdXN0aWNDb250ZXh0XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFJ1c3RpY0V4cHIgZXhwcmVzc2lvbiB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxucHVibGljIElSZWFkT25seUxpc3Q8UnVzdGljU3RhY2s+IHN0YWNrXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBleHByZXNzaW9uLnN0YWNrcztcclxuICAgIH1cclxufSAgICAgICAgcHVibGljIERpY3Rpb25hcnk8c3RyaW5nLCBvYmplY3Q+IHZhcmlhYmxlcyB7IGdldDsgc2V0OyB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5UZXh0O1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uXG57XG4gICAgY2xhc3MgUnVzdGljRXhwclxuICAgIHtcbiAgICAgICAgc3RhdGljIGJvb2wgUHJlZmVyU2ltcGxpZmllZEV4cHJlc3Npb24gPSBmYWxzZTtcbnN0YXRpYyBwdWJsaWMgaW50IEdldFZhcmlhYmxlSUQoc3RyaW5nIG5hbWUpXHJcbntcclxuICAgIHJldHVybiBuYW1lLkdldEhhc2hDb2RlKCk7XHJcbn1cbiAgICAgICAgcHVibGljIHJlYWRvbmx5IExpc3Q8UnVzdGljU3RhY2s+IHN0YWNrcyA9IG5ldyBMaXN0PFJ1c3RpY1N0YWNrPigpO1xuXG4gICAgICAgIFJ1c3RpY0NvbnRleHQgY29udGV4dDtcbnB1YmxpYyBSdXN0aWNFeHByKClcclxue1xyXG4gICAgUmVzZXRFeHByZXNzaW9uKCk7XHJcbn1wdWJsaWMgUnVzdGljRXhwcihzdHJpbmcgZXhwcmVzc2lvbik6IHRoaXMoKVxyXG57XHJcbiAgICBTZXRFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xyXG59XG4gICAgICAgIHB1YmxpYyB2b2lkIFJlc2V0RXhwcmVzc2lvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdGFja3MuQ2xlYXIoKTtcclxuICAgICAgICAgICAgY29udGV4dCA9IG5ldyBSdXN0aWNDb250ZXh0KCk7XHJcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldEV4cHJlc3Npb24oc3RyaW5nIGV4cHJlc3Npb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoUHJlZmVyU2ltcGxpZmllZEV4cHJlc3Npb24pXHJcbiAgICAgICAgICAgICAgICBuZXcgUnVzdGljRXhwckJ1aWxkZXIodGhpcywgY29udGV4dCwgZXhwcmVzc2lvbikuRmluYWxpemVBbmRTaW1wbGlmeSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBuZXcgUnVzdGljRXhwckJ1aWxkZXIodGhpcywgY29udGV4dCwgZXhwcmVzc2lvbikuRmluYWxpemVFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvYmplY3QgRXhlY3V0ZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoaW50IHIgPSBzdGFja3MuQ291bnQgLSAxOyByID49IDA7IHItLSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGFja3Nbcl0uRXhlY3V0ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc3RhY2tzWzBdLlJlc3VsdFZhbHVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgY2xhc3MgUnVzdGljRXhwckJ1aWxkZXJcclxuICAgIHtcclxuICAgICAgICBwcm90ZWN0ZWQgUnVzdGljRXhwciBleHByZXNzaW9uO1xyXG4gICAgICAgIHByb3RlY3RlZCBSdXN0aWNDb250ZXh0IGNvbnRleHQ7XHJcbiAgICAgICAgcHJvdGVjdGVkIFJ1c3RpY09wZXJhdGlvbiBuZXh0T3BlcmF0aW9uO1xyXG4gICAgICAgIHByb3RlY3RlZCBSdXN0aWNTdGFjayBjdXJyZW50U3RhY2s7XHJcbiAgICAgICAgcHJvdGVjdGVkIGludCBwcmlvcml0eU9mZnNldDtcclxucHJvdGVjdGVkIExpc3Q8UnVzdGljU3RhY2s+IHN0YWNrc1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbiE9bnVsbD9leHByZXNzaW9uLnN0YWNrczooTGlzdDxSdXN0aWNTdGFjaz4pbnVsbDtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHByb3RlY3RlZCBSdXN0aWNFeHByQnVpbGRlcigpIDogdGhpcyhudWxsLCBudWxsKSB7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFJ1c3RpY0V4cHJCdWlsZGVyKFJ1c3RpY0V4cHIgZXhwcmVzc2lvbiwgUnVzdGljQ29udGV4dCBjb250ZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKChleHByZXNzaW9uIT1udWxsP2V4cHJlc3Npb24uc3RhY2tzLkNvdW50OihpbnQ/KW51bGwpID4gMClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJSdXN0aWNFeHByIGluc3RhbmNlIHdhcyBhbHJlYWR5IGJ1aWx0IGFuZCBzaG91bGQgbm90IGJlIGJ1aWx0IGFnYWluLiBEaWQgeW91IGludGVuZCB0byBSZXNldEV4cHJlc3Npb24/XCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICAgICAgbmV4dE9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb25zLlNldCgpO1xyXG4gICAgICAgICAgICBwcmlvcml0eU9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIsc3RhY2tzKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPExpc3Q8UnVzdGljU3RhY2s+PihcImtleTFcIikuQWRkKG5ldyBSdXN0aWNTdGFjaygwLCBudWxsLCAxKSkpOm51bGw7XHJcbiAgICAgICAgICAgIGN1cnJlbnRTdGFjayA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkyXCIsc3RhY2tzKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8TGlzdDxSdXN0aWNTdGFjaz4+KFwia2V5MlwiKVswXTooUnVzdGljU3RhY2spbnVsbDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBSdXN0aWNFeHByQnVpbGRlcihSdXN0aWNFeHByIGV4cHJlc3Npb24sIFJ1c3RpY0NvbnRleHQgY29udGV4dCwgc3RyaW5nIGV4cHJlc3Npb25MaW5lKTogdGhpcyhleHByZXNzaW9uLCBjb250ZXh0KVxyXG57XHJcbiAgICBQYXJzZUFuZFB1dFRva2VucyhleHByZXNzaW9uTGluZSk7XHJcbn1wdWJsaWMgUnVzdGljRXhwckJ1aWxkZXIoUnVzdGljRXhwciBleHByZXNzaW9uLCBSdXN0aWNDb250ZXh0IGNvbnRleHQsIFJ1c3RpY1Rva2VuW10gdG9rZW5MaXN0KTogdGhpcyhleHByZXNzaW9uLCBjb250ZXh0KVxyXG57XHJcbiAgICBQdXRUb2tlbnModG9rZW5MaXN0KTtcclxufVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFBhcnNlQW5kUHV0VG9rZW5zKHN0cmluZyBleHByZXNzaW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUnVzdGljUGFyc2VyIHBhcnNlciA9IG5ldyBSdXN0aWNQYXJzZXIoY29udGV4dCk7XHJcbiAgICAgICAgICAgIFB1dFRva2VucyhFbnVtZXJhYmxlLlRvQXJyYXk8UnVzdGljVG9rZW4+KHBhcnNlci5HZXRUb2tlbkxpc3QoZXhwcmVzc2lvbikpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFB1dFRva2VucyhwYXJhbXMgUnVzdGljVG9rZW5bXSB0b2tlbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgdG9rZW4gaW4gdG9rZW5zKVxyXG4gICAgICAgICAgICAgICAgUHV0VG9rZW4odG9rZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUHV0VG9rZW4oUnVzdGljVG9rZW4gdG9rZW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRva2VuLm1vZGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgUnVzdGljVG9rZW5Nb2RlLkxpdGVyYWw6IFB1dFZhbHVlVG9rZW4odG9rZW4udmFsdWUpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgUnVzdGljVG9rZW5Nb2RlLlZhcmlhYmxlTmFtZTogUHV0VmFyaWFibGVUb2tlbih0b2tlbi52YWx1ZS5Ub1N0cmluZygpKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJ1c3RpY1Rva2VuTW9kZS5PcGVyYXRpb246IFB1dE9wZXJhdGlvblRva2VuKChSdXN0aWNPcGVyYXRpb24pdG9rZW4udmFsdWUpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgUnVzdGljVG9rZW5Nb2RlLlByaW9yaXR5T2Zmc2V0OiBDaGFuZ2VQcmlvcml0eSgoaW50KXRva2VuLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFB1dFZhbHVlVG9rZW4ob2JqZWN0IHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKG5leHRPcGVyYXRpb24gPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJFeHBlY3Rpbmcgb3BlcmF0b3IsIGJ1dCByZWNlaXZlZCB2YWx1ZVwiKTtcclxuICAgICAgICAgICAgbmV4dE9wZXJhdGlvbi5wYXJhbWV0ZXIgPSBuZXcgRXZhbHVhdG9ycy5MaXRlcmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgY3VycmVudFN0YWNrLm9wZXJhdGlvbnMuQWRkKG5leHRPcGVyYXRpb24pO1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBQdXRWYXJpYWJsZVRva2VuKHN0cmluZyB2YXJpYWJsZU5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobmV4dE9wZXJhdGlvbiA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIkV4cGVjdGluZyBvcGVyYXRvciwgYnV0IHJlY2VpdmVkIHZhbHVlXCIpO1xyXG4gICAgICAgICAgICBuZXh0T3BlcmF0aW9uLnBhcmFtZXRlciA9IG5ldyBFdmFsdWF0b3JzLlZhcmlhYmxlKGNvbnRleHQsIHZhcmlhYmxlTmFtZSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRTdGFjay5vcGVyYXRpb25zLkFkZChuZXh0T3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgbmV4dE9wZXJhdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgQ2hhbmdlUHJpb3JpdHkoaW50IGFkZGl0aW9uKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJpb3JpdHlPZmZzZXQgKz0gYWRkaXRpb247XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGlvbiA+IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFJ1c3RpY1N0YWNrIG5ld1N0YWNrID0gbmV3IFJ1c3RpY1N0YWNrKHN0YWNrcy5Db3VudCwgY3VycmVudFN0YWNrLCBwcmlvcml0eU9mZnNldCArIFJ1c3RpY09wZXJhdGlvbi5GaXJzdFByaW9yaXR5KTtcclxuICAgICAgICAgICAgICAgIG5leHRPcGVyYXRpb24ucGFyYW1ldGVyID0gbmV3IEV2YWx1YXRvcnMuU3RhY2tSZWZlcmVuY2UobmV3U3RhY2spO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YWNrLm9wZXJhdGlvbnMuQWRkKG5leHRPcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgaW50IGluZGV4ID0gc3RhY2tzLkluZGV4T2YoY3VycmVudFN0YWNrKTtcclxuICAgICAgICAgICAgICAgIHN0YWNrcy5JbnNlcnQoaW5kZXggKyAxLCBuZXdTdGFjayk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhY2sgPSBuZXdTdGFjaztcclxuICAgICAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBuZXcgT3BlcmF0aW9ucy5TZXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFB1dE9wZXJhdGlvblRva2VuKFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobmV4dE9wZXJhdGlvbiAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlVuZXhwZWN0ZWQgb3BlcmF0b3IgZm91bmRcIik7XHJcblxyXG4gICAgICAgICAgICBvcGVyYXRpb24ucHJpb3JpdHlPZmZzZXQgPSBwcmlvcml0eU9mZnNldDtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSA8PSAoaW50KVJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5JZ25vcmVkKVxyXG4gICAgICAgICAgICAgICAgUHV0T3BlcmF0aW9uT2ZFcXVhbE9ySWdub3JlZFByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgaWYgKChvcGVyYXRpb24uSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKCkgJiYgY3VycmVudFN0YWNrLnByaW9yaXR5IDw9IG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSkgfHwgY3VycmVudFN0YWNrLnByaW9yaXR5IDwgb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKSAvLyBUTy1ETzogQWx0ZXJhciBwYXJhIGluc2VyaXIgb3BlcmFkb3JlcyBSVExcclxuICAgICAgICAgICAgICAgIFB1dE9wZXJhdGlvbk9mSGlnaGVyUHJpb3JpdHkob3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0YWNrLnByaW9yaXR5ID4gb3BlcmF0aW9uLkdldFByaW9yaXR5V2l0aE9mZnNldCgpKVxyXG4gICAgICAgICAgICAgICAgUHV0T3BlcmF0aW9uT2ZMb3dlclByaW9yaXR5KG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIFB1dE9wZXJhdGlvbk9mRXF1YWxPcklnbm9yZWRQcmlvcml0eShvcGVyYXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFB1dE9wZXJhdGlvbk9mSGlnaGVyUHJpb3JpdHkoUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBvcGVyYXRpb247XHJcbiAgICAgICAgICAgIFJ1c3RpY09wZXJhdGlvbiBsYXN0T3BlcmF0aW9uRnJvbVN0YWNrID0gY3VycmVudFN0YWNrLm9wZXJhdGlvbnNbY3VycmVudFN0YWNrLm9wZXJhdGlvbnMuQ291bnQgLSAxXTtcclxuICAgICAgICAgICAgUnVzdGljVmFsdWVFdmFsdWF0b3IgbGFzdE9wZXJhdGlvblZhbHVlID0gbGFzdE9wZXJhdGlvbkZyb21TdGFjay5wYXJhbWV0ZXI7XHJcbiAgICAgICAgICAgIFJ1c3RpY1N0YWNrIG5ld1N0YWNrID0gbmV3IFJ1c3RpY1N0YWNrKHN0YWNrcy5Db3VudCwgY3VycmVudFN0YWNrLCBvcGVyYXRpb24uR2V0UHJpb3JpdHlXaXRoT2Zmc2V0KCkpO1xyXG4gICAgICAgICAgICBsYXN0T3BlcmF0aW9uRnJvbVN0YWNrLnBhcmFtZXRlciA9IG5ldyBFdmFsdWF0b3JzLlN0YWNrUmVmZXJlbmNlKG5ld1N0YWNrKTtcclxuICAgICAgICAgICAgUnVzdGljT3BlcmF0aW9uIG5ld1NldE9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb25zLlNldCgpO1xyXG4gICAgICAgICAgICBuZXdTZXRPcGVyYXRpb24ucGFyYW1ldGVyID0gbGFzdE9wZXJhdGlvblZhbHVlO1xyXG4gICAgICAgICAgICBuZXdTdGFjay5vcGVyYXRpb25zLkFkZChuZXdTZXRPcGVyYXRpb24pO1xyXG4gICAgICAgICAgICBpbnQgaW5kZXggPSBzdGFja3MuSW5kZXhPZihjdXJyZW50U3RhY2spO1xyXG4gICAgICAgICAgICBzdGFja3MuSW5zZXJ0KGluZGV4ICsgMSwgbmV3U3RhY2spO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhY2sgPSBuZXdTdGFjaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBQdXRPcGVyYXRpb25PZkxvd2VyUHJpb3JpdHkoUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBvcGVyYXRpb247XHJcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50U3RhY2sucHJpb3JpdHkgPiBvcGVyYXRpb24uR2V0UHJpb3JpdHlXaXRoT2Zmc2V0KCkpXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhY2sgPSBjdXJyZW50U3RhY2sucGFyZW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGFjay5wcmlvcml0eSA8IG9wZXJhdGlvbi5HZXRQcmlvcml0eVdpdGhPZmZzZXQoKSlcclxuICAgICAgICAgICAgICAgIFB1dE9wZXJhdGlvbk9mSGlnaGVyUHJpb3JpdHkob3BlcmF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBQdXRPcGVyYXRpb25PZkVxdWFsT3JJZ25vcmVkUHJpb3JpdHkoUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5leHRPcGVyYXRpb24gPSBvcGVyYXRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBGaW5hbGl6ZUV4cHJlc3Npb24oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFJ1c3RpY1N0YWNrIHN0YWNrIGluIHN0YWNrcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3RhY2suZGlzcGxheUlkID0gKytpbmRleDtcclxuICAgICAgICAgICAgICAgIHN0YWNrLlByZXBhcmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU2ltcGxpZnlFeHByZXNzaW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhhc2hTZXQ8UnVzdGljU3RhY2s+IGRpc2NhcmQgPSBudWxsO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChSdXN0aWNTdGFjayBzdGFjayBpbiBzdGFja3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvcmVhY2ggKFJ1c3RpY09wZXJhdGlvbiBvcGVyYXRpb24gaW4gc3RhY2sub3BlcmF0aW9ucylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBFdmFsdWF0b3JzLlN0YWNrUmVmZXJlbmNlIHJlZmVyZW5jZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9vbCBoYXNSZWZQYXJhbSA9IG9wZXJhdGlvbi5wYXJhbWV0ZXIgIT0gbnVsbCAmJiAocmVmZXJlbmNlID0gb3BlcmF0aW9uLnBhcmFtZXRlciBhcyBFdmFsdWF0b3JzLlN0YWNrUmVmZXJlbmNlKSAhPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvb2wgY2FuQmVTaW1wbGlmaWVkID0gaGFzUmVmUGFyYW0gJiYgcmVmZXJlbmNlLnN0YWNrLkNhbkJlU2ltcGxpZmllZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuQmVTaW1wbGlmaWVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLnBhcmFtZXRlciA9IHJlZmVyZW5jZS5zdGFjay5vcGVyYXRpb25zWzBdLnBhcmFtZXRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzY2FyZCA9IGRpc2NhcmQgPz8gbmV3IEhhc2hTZXQ8UnVzdGljU3RhY2s+KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2NhcmQuQWRkKHJlZmVyZW5jZS5zdGFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlzY2FyZCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCAoUnVzdGljU3RhY2sgaXRlbSBpbiBkaXNjYXJkKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrcy5SZW1vdmUoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTaW1wbGlmeSB0aGUgc3RhY2sgcmVnaXN0ZXIgUjBcclxuICAgICAgICAgICAgaWYgKHN0YWNrcy5Db3VudCA+IDAgJiYgc3RhY2tzWzBdLm9wZXJhdGlvbnMuQ291bnQgPT0gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgUnVzdGljT3BlcmF0aW9uIHNldDtcclxuICAgICAgICAgICAgICAgIGlmICgoc2V0ID0gc3RhY2tzWzBdLm9wZXJhdGlvbnNbMF0gYXMgT3BlcmF0aW9ucy5TZXQpICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tzWzBdLm9wZXJhdGlvbnMuQ2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBSdXN0aWNTdGFjayBzdGFjayA9ICgoRXZhbHVhdG9ycy5TdGFja1JlZmVyZW5jZSlzZXQucGFyYW1ldGVyKS5zdGFjaztcclxuICAgICAgICAgICAgICAgICAgICBzdGFja3NbMF0ub3BlcmF0aW9ucy5BZGRSYW5nZShzdGFjay5vcGVyYXRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFja3NbMF0ucHJpb3JpdHkgPSBzdGFjay5wcmlvcml0eTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFja3MuUmVtb3ZlKHN0YWNrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBGaW5hbGl6ZUV4cHJlc3Npb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEZpbmFsaXplQW5kU2ltcGxpZnkoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRmluYWxpemVFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIFNpbXBsaWZ5RXhwcmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyB2b2lkIFNpbXBsaWZ5RXhwcmVzc2lvbihSdXN0aWNFeHByIGV4cHJlc3Npb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBSdXN0aWNFeHByQnVpbGRlciBidWlsZGVyID0gbmV3IFJ1c3RpY0V4cHJCdWlsZGVyKCk7XHJcbiAgICAgICAgICAgIGJ1aWxkZXIuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgICAgICAgICAgIGJ1aWxkZXIuU2ltcGxpZnlFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxyXG57XHJcbiAgICBjbGFzcyBSdXN0aWNQYXJzZXJcclxuICAgIHtcclxuICAgICAgICAvLyBQcmlvcml0eUdyb3VwXHJcbiAgICAgICAgcmVhZG9ubHkgcHVibGljIExpc3Q8R2VuZXJpY0NhcHR1cmU+IE9wZW5Hcm91cFBhdHRlcm4gPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxHZW5lcmljQ2FwdHVyZT4oKSwoX28xKT0+e19vMS5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKFwiWyhdXCIsIFJ1c3RpY1Rva2VuTW9kZS5Qcmlvcml0eU9mZnNldCwgKHAscykgPT4gKzEwMCkpO3JldHVybiBfbzE7fSk7XHJcblxyXG4gICAgICAgIHJlYWRvbmx5IHB1YmxpYyBMaXN0PEdlbmVyaWNDYXB0dXJlPiBDbG9zZUdyb3VwUGF0dGVybiA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PEdlbmVyaWNDYXB0dXJlPigpLChfbzIpPT57X28yLkFkZChuZXcgR2VuZXJpY0NhcHR1cmUoXCJbKV1cIiwgUnVzdGljVG9rZW5Nb2RlLlByaW9yaXR5T2Zmc2V0LCAocCxzKSA9PiAtMTAwKSk7cmV0dXJuIF9vMjt9KTtcclxuXHJcbiAgICAgICAgLy8gTWlkZGxlT3BlcmF0b3JzXHJcbiAgICAgICAgcmVhZG9ubHkgcHVibGljIExpc3Q8T3BlcmF0aW9uQ2FwdHVyZT4gTWlkZGxlT3BlcmF0b3JzID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8T3BlcmF0aW9uQ2FwdHVyZT4oKSwoX28zKT0+e19vMy5BZGQobmV3IE9wZXJhdGlvbkNhcHR1cmUoXCJbKl1bKl1cIiwgbmV3IE9wZXJhdGlvbnMuUG93KCkpKTtfbzMuQWRkKG5ldyBPcGVyYXRpb25DYXB0dXJlKFwiWytdXCIsIG5ldyBPcGVyYXRpb25zLkFkZCgpKSk7X28zLkFkZChuZXcgT3BlcmF0aW9uQ2FwdHVyZShcIlstXVwiLCBuZXcgT3BlcmF0aW9ucy5TdWIoKSkpO19vMy5BZGQobmV3IE9wZXJhdGlvbkNhcHR1cmUoXCJbKl1cIiwgbmV3IE9wZXJhdGlvbnMuTXVsKCkpKTtfbzMuQWRkKG5ldyBPcGVyYXRpb25DYXB0dXJlKFwiWy9dXCIsIG5ldyBPcGVyYXRpb25zLkRpdigpKSk7cmV0dXJuIF9vMzt9KTtcclxuXHJcbiAgICAgICAgLy8gTGVmdE9wZXJhdG9yc1xyXG4gICAgICAgIHJlYWRvbmx5IHB1YmxpYyBMaXN0PE9wZXJhdGlvbkNhcHR1cmU+IExlZnRPcGVyYXRvcnMgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxPcGVyYXRpb25DYXB0dXJlPigpLChfbzQpPT57X280LkFkZChuZXcgT3BlcmF0aW9uQ2FwdHVyZShcIlsrXSg/IVsuMC05XSlcIiwgbmV3IE9wZXJhdGlvbnMuUHJlZml4VW5hcnkuUG9zaXRpdmUoKSkpO19vNC5BZGQobmV3IE9wZXJhdGlvbkNhcHR1cmUoXCJbLV0oPyFbLjAtOV0pXCIsIG5ldyBPcGVyYXRpb25zLlByZWZpeFVuYXJ5Lk5lZ2F0aXZlKCkpKTtyZXR1cm4gX280O30pO1xyXG5cclxuICAgICAgICAvLyBWYWx1ZVBhdHRlcm5cclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxHZW5lcmljQ2FwdHVyZT4gVmFsdWVQYXR0ZXJuID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8R2VuZXJpY0NhcHR1cmU+KCksKF9vNSk9PntfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldK1tYeCVdPyg/IVsuXVxcZHxcXHcpXCIsIFJ1c3RpY1Rva2VuTW9kZS5MaXRlcmFsLCAocGFyc2VyLCB2YWx1ZSkgPT4gU3RyaW5nVG9JbnQzMih2YWx1ZSwgJ1gnLCAneCcsICclJykpKTtfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldKyg/OlsuXVswLTldKyk/KD86W0VlXVstK10/WzAtOV0rKT9bRmZYeCVdKD8hXFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvRmxvYXQodmFsdWUsICdGJywgJ2YnLCAnWCcsICd4JywgJyUnKSkpO19vNS5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKEBcIlstK10/WzAtOV0qWy5dWzAtOV0rKD86W0VlXVstK10/WzAtOV0rKT9bRmZYeCVdKD8hXFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvRmxvYXQodmFsdWUsICdGJywgJ2YnLCAnWCcsICd4JywgJyUnKSkpO19vNS5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKEBcIlstK10/WzAtOV0rKD86Wy5dWzAtOV0rKT8oPzpbRWVdWy0rXT9bMC05XSspP1tEZF0/KD8hXFx3KVwiLCBSdXN0aWNUb2tlbk1vZGUuTGl0ZXJhbCwgKHBhcnNlciwgdmFsdWUpID0+IFN0cmluZ1RvRG91YmxlKHZhbHVlLCAnRCcsICdkJykpKTtfbzUuQWRkKG5ldyBHZW5lcmljQ2FwdHVyZShAXCJbLStdP1swLTldKlsuXVswLTldKyg/OltFZV1bLStdP1swLTldKyk/W0RkXT8oPyFcXHcpXCIsIFJ1c3RpY1Rva2VuTW9kZS5MaXRlcmFsLCAocGFyc2VyLCB2YWx1ZSkgPT4gU3RyaW5nVG9Eb3VibGUodmFsdWUsICdEJywgJ2QnKSkpO19vNS5BZGQobmV3IEdlbmVyaWNDYXB0dXJlKEBcIltBLVphLXpfXVxcdypcIiwgUnVzdGljVG9rZW5Nb2RlLlZhcmlhYmxlTmFtZSwgKHBhcnNlciwgdmFsdWUpID0+IG5ldyBFdmFsdWF0b3JzLlZhcmlhYmxlKHBhcnNlci5jb250ZXh0LCB2YWx1ZSkpKTtyZXR1cm4gX281O30pO1xyXG5cclxuICAgICAgICByZWFkb25seSBwdWJsaWMgTGlzdDxzdHJpbmc+IElnbm9yZWRQYXR0ZXJuID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8c3RyaW5nPigpLChfbzYpPT57X282LkFkZChAXCJcXHMrXCIpO3JldHVybiBfbzY7fSk7XHJcblxyXG4gICAgICAgIGJvb2wgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICBSdXN0aWNDb250ZXh0IGNvbnRleHQ7XHJcbiAgICAgICAgUmVnZXggdmFsdWVFeHByO1xyXG4gICAgICAgIFJlZ2V4IGxlZnRPcEV4cHI7XHJcbiAgICAgICAgUmVnZXggbWlkT3BFeHByO1xyXG4gICAgICAgIFJlZ2V4IGlnbm9yZWRFeHByO1xyXG4gICAgICAgIFJlZ2V4IG9wZW5Hcm91cEV4cHI7XHJcbiAgICAgICAgUmVnZXggY2xvc2VHcm91cEV4cHI7XHJcbiAgICAgICAgUmVnZXggdW5leHBlY3RlZFRva2VuRXhwciA9IG5ldyBSZWdleChAXCJcXHMqKFstJC5cXHddK3xbXlxcd1xcc10pXCIpO1xyXG5cclxuICAgICAgICBTdGFjazxQYXJzaW5nU3RhdGU+IGN1cnJlbnRTdGF0ZSA9IG5ldyBTdGFjazxQYXJzaW5nU3RhdGU+KCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNQYXJzZXIoUnVzdGljQ29udGV4dCBjb250ZXh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIEluaXRpYWxpemUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUmVnZXhPcHRpb25zIG9wdGlvbnMgPSBSZWdleE9wdGlvbnMuTm9uZTtcclxuICAgICAgICAgICAgdmFsdWVFeHByID0gbmV3IFJlZ2V4KHN0cmluZy5Gb3JtYXQoXCIoezB9KVwiLHN0cmluZy5Kb2luKFwiKXwoXCIsIFZhbHVlUGF0dGVybi5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuR2VuZXJpY0NhcHR1cmUsc3RyaW5nPikodiA9PiB2LnBhdHRlcm4pKSkgKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGxlZnRPcEV4cHIgPSBuZXcgUmVnZXgoc3RyaW5nLkZvcm1hdChcIih7MH0pXCIsc3RyaW5nLkpvaW4oXCIpfChcIiwgTGVmdE9wZXJhdG9ycy5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuT3BlcmF0aW9uQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSApLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgbWlkT3BFeHByID0gbmV3IFJlZ2V4KHN0cmluZy5Gb3JtYXQoXCIoezB9KVwiLHN0cmluZy5Kb2luKFwiKXwoXCIsIE1pZGRsZU9wZXJhdG9ycy5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuT3BlcmF0aW9uQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSApLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgb3Blbkdyb3VwRXhwciA9IG5ldyBSZWdleChzdHJpbmcuRm9ybWF0KFwiKHswfSlcIixzdHJpbmcuSm9pbihcIil8KFwiLCBPcGVuR3JvdXBQYXR0ZXJuLkNvbnZlcnRBbGw8c3RyaW5nPigoQ29udmVydGVyPFJ1c3RpY1BhcnNlci5HZW5lcmljQ2FwdHVyZSxzdHJpbmc+KSh2ID0+IHYucGF0dGVybikpKSksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjbG9zZUdyb3VwRXhwciA9IG5ldyBSZWdleChzdHJpbmcuRm9ybWF0KFwiKHswfSlcIixzdHJpbmcuSm9pbihcIil8KFwiLCBDbG9zZUdyb3VwUGF0dGVybi5Db252ZXJ0QWxsPHN0cmluZz4oKENvbnZlcnRlcjxSdXN0aWNQYXJzZXIuR2VuZXJpY0NhcHR1cmUsc3RyaW5nPikodiA9PiB2LnBhdHRlcm4pKSkpLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgaWdub3JlZEV4cHIgPSBuZXcgUmVnZXgoc3RyaW5nLkZvcm1hdChcIih7MH0pXCIsc3RyaW5nLkpvaW4oXCIpfChcIiwgSWdub3JlZFBhdHRlcm4pKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgSUVudW1lcmFibGU8UnVzdGljVG9rZW4+IEdldFRva2VuTGlzdChzdHJpbmcgZXhwcmVzc2lvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbml0aWFsaXplZCA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIEluaXRpYWxpemUoKTtcclxuXHJcbiAgICAgICAgICAgIGludCBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGV4cHJlc3Npb24uVHJpbSgpO1xyXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUuQ2xlYXIoKTtcclxuICAgICAgICAgICAgY3VycmVudFN0YXRlLlB1c2goUGFyc2luZ1N0YXRlLlZhbHVlT3JMZWZ0T3BlcmF0b3JPckVuZCk7XHJcblxyXG4gICAgICAgICAgICB3aGlsZShjdXJyZW50U3RhdGUuQ291bnQgPiAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcnlDYXB0dXJlSWdub3JlZFBhdHRlcm4oZXhwcmVzc2lvbiwgcmVmIGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBSdXN0aWNUb2tlbiByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjdXJyZW50U3RhdGUuUG9wKCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kOiByZXN1bHQgPSBUcnlDYXB0dXJlVmFsdWVPckxlZnRPcGVyYXRvcihleHByZXNzaW9uLCByZWYgaW5kZXgpOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFBhcnNpbmdTdGF0ZS5WYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWQ6IHJlc3VsdCA9IENhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKGV4cHJlc3Npb24sIHJlZiBpbmRleCk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgUGFyc2luZ1N0YXRlLk1pZGRsZU9wZXJhdG9yT3JFbmQ6IHJlc3VsdCA9IFRyeUNhcHR1cmVNaWRkbGVPcGVyYXRvcihleHByZXNzaW9uLCByZWYgaW5kZXgpOyBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgVHJ5Q2FwdHVyZUlnbm9yZWRQYXR0ZXJuKGV4cHJlc3Npb24sIHJlZiBpbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IGV4cHJlc3Npb24uTGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiVW5leHBlY3RlZCBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzOiB7MH1cIixleHByZXNzaW9uLlN1YnN0cmluZyhpbmRleCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFJ1c3RpY1Rva2VuIFRyeUNhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKHN0cmluZyBleHByZXNzaW9uLCByZWYgaW50IGluZGV4LCBib29sIGNhbkVuZEdyb3VwcyA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBNYXRjaCBtYXRjaDtcclxuICAgICAgICAgICAgaWYgKChtYXRjaCA9IFN0aWNreU1hdGNoKG9wZW5Hcm91cEV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5WYWx1ZU9yTGVmdE9wZXJhdG9yT3JFbmQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9wZW5Hcm91cFBhdHRlcm5bRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKHRoaXMsIG1hdGNoLlZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChtYXRjaCA9IFN0aWNreU1hdGNoKGxlZnRPcEV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5WYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIExlZnRPcGVyYXRvcnNbRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSBTdGlja3lNYXRjaCh2YWx1ZUV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5NaWRkbGVPcGVyYXRvck9yRW5kKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBWYWx1ZVBhdHRlcm5bRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKHRoaXMsIG1hdGNoLlZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhbkVuZEdyb3VwcyAmJiAobWF0Y2ggPSBTdGlja3lNYXRjaChjbG9zZUdyb3VwRXhwciwgZXhwcmVzc2lvbiwgcmVmIGluZGV4KSkuU3VjY2VzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlLlB1c2goUGFyc2luZ1N0YXRlLk1pZGRsZU9wZXJhdG9yT3JFbmQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIENsb3NlR3JvdXBQYXR0ZXJuW0ZpbmRTdWNjZWRlZEdyb3VwSW5kZXgobWF0Y2gpIC0gMV0uVG9Ub2tlbih0aGlzLCBtYXRjaC5WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBSdXN0aWNUb2tlbiBDYXB0dXJlVmFsdWVPckxlZnRPcGVyYXRvcihzdHJpbmcgZXhwcmVzc2lvbiwgcmVmIGludCBpbmRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFJ1c3RpY1Rva2VuIHJlc3VsdCA9IFRyeUNhcHR1cmVWYWx1ZU9yTGVmdE9wZXJhdG9yKGV4cHJlc3Npb24sIHJlZiBpbmRleCwgY2FuRW5kR3JvdXBzOiBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJVbmV4cGVjdGVkIHRva2VuOiBcIit1bmV4cGVjdGVkVG9rZW5FeHByLk1hdGNoKGV4cHJlc3Npb24sIGluZGV4KSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBSdXN0aWNUb2tlbiBUcnlDYXB0dXJlTWlkZGxlT3BlcmF0b3Ioc3RyaW5nIGV4cHJlc3Npb24sIHJlZiBpbnQgaW5kZXgsIGJvb2wgY2FuRW5kR3JvdXBzID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIE1hdGNoIG1hdGNoO1xyXG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gU3RpY2t5TWF0Y2gobWlkT3BFeHByLCBleHByZXNzaW9uLCByZWYgaW5kZXgpKS5TdWNjZXNzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUuUHVzaChQYXJzaW5nU3RhdGUuVmFsdWVPckxlZnRPcGVyYXRvckV4cGVjdGVkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNaWRkbGVPcGVyYXRvcnNbRmluZFN1Y2NlZGVkR3JvdXBJbmRleChtYXRjaCkgLSAxXS5Ub1Rva2VuKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjYW5FbmRHcm91cHMgJiYgKG1hdGNoID0gU3RpY2t5TWF0Y2goY2xvc2VHcm91cEV4cHIsIGV4cHJlc3Npb24sIHJlZiBpbmRleCkpLlN1Y2Nlc3MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZS5QdXNoKFBhcnNpbmdTdGF0ZS5NaWRkbGVPcGVyYXRvck9yRW5kKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBDbG9zZUdyb3VwUGF0dGVybltGaW5kU3VjY2VkZWRHcm91cEluZGV4KG1hdGNoKSAtIDFdLlRvVG9rZW4odGhpcywgbWF0Y2guVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbnZvaWQgVHJ5Q2FwdHVyZUlnbm9yZWRQYXR0ZXJuKHN0cmluZyBleHByZXNzaW9uLCByZWYgaW50IGluZGV4KVxyXG57XHJcbiAgICBTdGlja3lNYXRjaChpZ25vcmVkRXhwciwgZXhwcmVzc2lvbiwgcmVmIGluZGV4KTtcclxufVxyXG4gICAgICAgIHN0YXRpYyBvYmplY3QgU3RyaW5nVG9JbnQzMihzdHJpbmcgdmFsdWUsIHBhcmFtcyBjaGFyW10gdHJpbUNoYXJzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGludFZhbHVlID0gQ29udmVydC5Ub0ludDMyKHZhbHVlLlRyaW1FbmQodHJpbUNoYXJzKSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5FbmRzV2l0aChcIiVcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50VmFsdWUgLyAxMDBmO1xyXG4gICAgICAgICAgICByZXR1cm4gQ29udmVydC5Ub0ludDMyKGludFZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBvYmplY3QgU3RyaW5nVG9GbG9hdChzdHJpbmcgdmFsdWUsIHBhcmFtcyBjaGFyW10gdHJpbUNoYXJzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZmxvYXQgZmxvYXRWYWx1ZSA9IENvbnZlcnQuVG9TaW5nbGUoKHZhbHVlLlN0YXJ0c1dpdGgoXCIuXCIpID8gXCIwXCIgOiBcIlwiKSArIHZhbHVlLlRyaW1FbmQodHJpbUNoYXJzKSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5FbmRzV2l0aChcIiVcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmxvYXRWYWx1ZSAvIDEwMGY7XHJcbiAgICAgICAgICAgIHJldHVybiBmbG9hdFZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIG9iamVjdCBTdHJpbmdUb0RvdWJsZShzdHJpbmcgdmFsdWUsIHBhcmFtcyBjaGFyW10gdHJpbUNoYXJzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZG91YmxlIGRvdWJsZVZhbHVlID0gQ29udmVydC5Ub1NpbmdsZSh2YWx1ZS5UcmltRW5kKHRyaW1DaGFycykpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUuRW5kc1dpdGgoXCIlXCIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvdWJsZVZhbHVlIC8gMTAwZDtcclxuICAgICAgICAgICAgcmV0dXJuIGRvdWJsZVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIE1hdGNoIFN0aWNreU1hdGNoKFJlZ2V4IHJlZ2V4LCBzdHJpbmcgaW5wdXQsIHJlZiBpbnQgaW5kZXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBNYXRjaCBtYXRjaCA9IHJlZ2V4Lk1hdGNoKGlucHV0LCBpbmRleCk7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaC5JbmRleCAhPSBpbmRleClcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRjaC5FbXB0eTtcclxuXHJcbiAgICAgICAgICAgIGluZGV4ID0gbWF0Y2guSW5kZXggKyBtYXRjaC5MZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBpbnQgRmluZFN1Y2NlZGVkR3JvdXBJbmRleChNYXRjaCBtYXRjaClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaC5TdWNjZXNzID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgaSA9IDE7IGkgPCBtYXRjaC5Hcm91cHMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoLkdyb3Vwc1tpXS5TdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBPcGVyYXRpb25DYXB0dXJlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwdWJsaWMgc3RyaW5nIHBhdHRlcm47XHJcbiAgICAgICAgICAgIHB1YmxpYyBSdXN0aWNPcGVyYXRpb24gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICBwdWJsaWMgT3BlcmF0aW9uQ2FwdHVyZShzdHJpbmcgcGF0dGVybiwgUnVzdGljT3BlcmF0aW9uIG9wZXJhdGlvbilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlcmF0aW9uID0gb3BlcmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbnB1YmxpYyBSdXN0aWNUb2tlbiBUb1Rva2VuKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBSdXN0aWNUb2tlbihSdXN0aWNUb2tlbk1vZGUuT3BlcmF0aW9uLCBBY3RpdmF0b3IuQ3JlYXRlSW5zdGFuY2Uob3BlcmF0aW9uLkdldFR5cGUoKSkpO1xyXG59ICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBHZW5lcmljQ2FwdHVyZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHVibGljIHN0cmluZyBwYXR0ZXJuO1xyXG4gICAgICAgICAgICBwdWJsaWMgRnVuYzxSdXN0aWNQYXJzZXIsIHN0cmluZyxvYmplY3Q+IHZhbHVlO1xyXG4gICAgICAgICAgICBwdWJsaWMgUnVzdGljVG9rZW5Nb2RlIG1vZGU7XHJcbiAgICAgICAgICAgIHB1YmxpYyBHZW5lcmljQ2FwdHVyZShzdHJpbmcgcGF0dGVybiwgUnVzdGljVG9rZW5Nb2RlIG1vZGUsIEZ1bmM8UnVzdGljUGFyc2VyLCBzdHJpbmcsb2JqZWN0PiB2YWx1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZSA9IG1vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHVibGljIFJ1c3RpY1Rva2VuIFRvVG9rZW4oUnVzdGljUGFyc2VyIHBhcnNlciwgc3RyaW5nIGNhcHR1cmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QgcmVzdWx0ID0gdmFsdWUocGFyc2VyLCBjYXB0dXJlZCk7XHJcblJ1c3RpY1Rva2VuIHRva2VuOyAgICAgICAgICAgICAgICByZXR1cm4gKHRva2VuID0gcmVzdWx0IGFzIFJ1c3RpY1Rva2VuKSAhPSBudWxsPyB0b2tlbiA6IG5ldyBSdXN0aWNUb2tlbihtb2RlLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBQYXJzaW5nU3RhdGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFRoZSBleHByZXNzaW9uIGV4cGVjdHMgYSB2YWx1ZSBvciBtYXkgYmUgZW1wdHksIGxpa2UgaW4gKCApXHJcbiAgICAgICAgICAgIC8vLyBcclxuICAgICAgICAgICAgLy8vIDxwYXJhPlxyXG4gICAgICAgICAgICAvLy8gTmV4dCBzdGF0ZTo8YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiB2YWx1ZSBmb3VuZDogPHNlZSBjcmVmPVwiTWlkZGxlT3BlcmF0b3JPckVuZFwiIC8+LjxiciAvPlxyXG4gICAgICAgICAgICAvLy8gICAtIE9uIGxlZnQgb3BlcmF0b3IgZm91bmQ6IDxzZWUgY3JlZj1cIlZhbHVlT3JMZWZ0T3BlcmF0b3JFeHBlY3RlZFwiLz48YnIgLz5cclxuICAgICAgICAgICAgLy8vIDwvcGFyYT5cclxuICAgICAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAgICAgVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kLFxyXG5cclxuICAgICAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgICAgICAvLy8gVGhlIGV4cHJlc3Npb24gZXhwZWN0cyBhIHZhbHVlLCBsaWtlIGluIEEgKyBCICsgP1xyXG4gICAgICAgICAgICAvLy8gXHJcbiAgICAgICAgICAgIC8vLyA8cGFyYT5cclxuICAgICAgICAgICAgLy8vIE5leHQgc3RhdGU6PGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyAgIC0gT24gdmFsdWUgZm91bmQ6IDxzZWUgY3JlZj1cIk1pZGRsZU9wZXJhdG9yT3JFbmRcIiAvPi48YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiBsZWZ0IG9wZXJhdG9yIGZvdW5kOiA8c2VlIGNyZWY9XCJWYWx1ZU9yTGVmdE9wZXJhdG9yRXhwZWN0ZWRcIi8+PGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmE+XHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIFZhbHVlT3JMZWZ0T3BlcmF0b3JFeHBlY3RlZCxcclxuXHJcbiAgICAgICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAgICAgLy8vIFRoZSBleHByZXNzaW9uIGV4cGVjdHMgYSBtaWRkbGUgb3BlcmF0b3Igb3IgdGhlIGVuZCBvZiB0aGUgZXhwcmVzc2lvbiwgbGlrZSBpbiBBICsgQiA/XHJcbiAgICAgICAgICAgIC8vLyBcclxuICAgICAgICAgICAgLy8vIDxwYXJhPlxyXG4gICAgICAgICAgICAvLy8gTmV4dCBzdGF0ZTo8YnIgLz5cclxuICAgICAgICAgICAgLy8vICAgLSBPbiBvcGVyYXRvciBmb3VuZDogPHNlZSBjcmVmPVwiVmFsdWVPckxlZnRPcGVyYXRvck9yRW5kXCIgLz4uPGJyIC8+XHJcbiAgICAgICAgICAgIC8vLyA8L3BhcmE+XHJcbiAgICAgICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgICAgIE1pZGRsZU9wZXJhdG9yT3JFbmQsXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb25cclxue1xyXG4gICAgaW50ZXJuYWwgY2xhc3MgUnVzdGljU3RhY2tcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgaW50IGRpc3BsYXlJZDtcclxuICAgICAgICBwdWJsaWMgaW50IHByaW9yaXR5O1xyXG4gICAgICAgIHB1YmxpYyBSdXN0aWNTdGFjayBwYXJlbnQ7XHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IExpc3Q8UnVzdGljT3BlcmF0aW9uPiBvcGVyYXRpb25zID0gbmV3IExpc3Q8UnVzdGljT3BlcmF0aW9uPigpO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGV4ZWN1dGVkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5wdWJsaWMgYm9vbCBDYW5CZVNpbXBsaWZpZWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG9wZXJhdGlvbnMuQ291bnQgPT0gMSAmJiBvcGVyYXRpb25zWzBdIGlzIE9wZXJhdGlvbnMuU2V0ICYmIG9wZXJhdGlvbnNbMF0ucGFyYW1ldGVyICE9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgb2JqZWN0IFJlc3VsdFZhbHVlIHtcclxuICAgICAgICAgICAgZ2V0IHtcclxuICAgICAgICAgICAgICAgIGlmIChleGVjdXRlZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeXN0ZW0uRXhjZXB0aW9uKFwiVGhpcyBzdGFjayBkaWQgbm90IGV4ZWN1dGUgeWV0XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvYmplY3QgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICBUeXBlIHJlc3VsdFR5cGUgPSBudWxsO1xyXG5cclxuICAgICAgICBwdWJsaWMgUnVzdGljU3RhY2soaW50IGlkLCBSdXN0aWNTdGFjayBwYXJlbnQsIGludCBwcmlvcml0eSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUlkID0gaWQ7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgICAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBQcmVwYXJlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFByZXZpZXdSZXN1bHRUeXBlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBFeGVjdXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IDBmO1xyXG4gICAgICAgICAgICBmb3IgKGludCBpID0gMDsgaSA8IG9wZXJhdGlvbnMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gb3BlcmF0aW9uc1tpXS5FeGVjdXRlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXhlY3V0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFR5cGUgUHJldmlld1Jlc3VsdFR5cGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdFR5cGUgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yKGludCBpID0gMDsgaSA8IG9wZXJhdGlvbnMuQ291bnQ7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRUeXBlID0gb3BlcmF0aW9uc1tpXS5QcmV2aWV3UmVzdWx0VHlwZShyZXN1bHRUeXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFR5cGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgc3RyID0gXCIgKFwiO1xyXG4gICAgICAgICAgICBmb3IoaW50IGkgPSAwOyBpIDwgb3BlcmF0aW9ucy5Db3VudDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gb3BlcmF0aW9uc1tpXS5Ub0V4cHJlc3Npb25TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHIgKz0gXCIgKVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX2V4ZWN1dGVkPWZhbHNlO31cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvblxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUnVzdGljVG9rZW5cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgUnVzdGljVG9rZW5Nb2RlIG1vZGU7XHJcbiAgICAgICAgcHVibGljIG9iamVjdCB2YWx1ZTtcclxuXHJcbiAgICAgICAgcHVibGljIFJ1c3RpY1Rva2VuKFJ1c3RpY1Rva2VuTW9kZSBtb2RlLCBvYmplY3QgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCJSdXN0aWNUb2tlbih7MH0sIFxcXCJ7MX1cXFwiKVwiLG1vZGUsdmFsdWUpO1xyXG59ICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW51bSBSdXN0aWNUb2tlbk1vZGVcclxuICAgIHtcclxuICAgICAgICBJZ25vcmVkLFxyXG4gICAgICAgIExpdGVyYWwsXHJcbiAgICAgICAgVmFyaWFibGVOYW1lLFxyXG4gICAgICAgIE9wZXJhdGlvbixcclxuICAgICAgICBQcmlvcml0eU9mZnNldCxcclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxuXHJcbm5hbWVzcGFjZSBMaXZlUHJldmlld1xyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgc3RhdGljIEhUTUxEaXZFbGVtZW50IFJlc3VsdEJveDtcclxuICAgICAgICBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBJbnB1dEV4cHJlc3Npb247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIEhUTUxcclxuICAgICAgICAgICAgUmVzdWx0Qm94ID0gRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiZXhwci1yZXN1bHRib3hcIik7XHJcbiAgICAgICAgICAgIElucHV0RXhwcmVzc2lvbiA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkPEhUTUxJbnB1dEVsZW1lbnQ+KFwidEV4cHJlc3Npb25cIik7XHJcblxyXG4gICAgICAgICAgICBJbnB1dEV4cHJlc3Npb24uT25JbnB1dCA9IE9uSW5wdXRFeHByZXNzaW9uO1xyXG5cclxuICAgICAgICAgICAgT25JbnB1dEV4cHJlc3Npb24obnVsbCk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gSU5TVFJVQ1RJT05TXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT1cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgLy8gQWZ0ZXIgYnVpbGRpbmcgKEN0cmwgKyBTaGlmdCArIEIpIHRoaXMgcHJvamVjdCwgXHJcbiAgICAgICAgICAgIC8vIGJyb3dzZSB0byB0aGUgL2Jpbi9EZWJ1ZyBvciAvYmluL1JlbGVhc2UgZm9sZGVyLlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBBIG5ldyBicmlkZ2UvIGZvbGRlciBoYXMgYmVlbiBjcmVhdGVkIGFuZFxyXG4gICAgICAgICAgICAvLyBjb250YWlucyB5b3VyIHByb2plY3RzIEphdmFTY3JpcHQgZmlsZXMuIFxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBPcGVuIHRoZSBicmlkZ2UvaW5kZXguaHRtbCBmaWxlIGluIGEgYnJvd3NlciBieVxyXG4gICAgICAgICAgICAvLyBSaWdodC1DbGljayA+IE9wZW4gV2l0aC4uLiwgdGhlbiBjaG9vc2UgYVxyXG4gICAgICAgICAgICAvLyB3ZWIgYnJvd3NlciBmcm9tIHRoZSBsaXN0LlxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyBUaGlzIGFwcGxpY2F0aW9uIHdpbGwgdGhlbiBydW4gaW4gdGhlIGJyb3dzZXJcclxuICAgICAgICAgICAgLy8gYW5kIHlvdSB3aWxsIGJlIGFibGUgdG8gdGVzdCBpdC5cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgdm9pZCBPbklucHV0RXhwcmVzc2lvbihFdmVudDxIVE1MSW5wdXRFbGVtZW50PiBldilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSdXN0aWNFeHByIGV4cHIgPSBuZXcgUnVzdGljRXhwcihJbnB1dEV4cHJlc3Npb24uVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgZXhwci5FeGVjdXRlKCk7XHJcbiAgICAgICAgICAgICAgICBSZXN1bHRCb3guSW5uZXJIVE1MID0gZXhwci5QcmludFRvSHRtbCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKEV4Y2VwdGlvbiBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBSZXN1bHRCb3guSW5uZXJIVE1MID0gc3RyaW5nLkZvcm1hdChcIkZpeCB5b3VyIGZvcm11bGE6IHswfVwiLGUuTWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9leHByLlByaW50RGVidWcoKTsgLy8gQ29uc29sZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBMaXZlUHJldmlld1xyXG57XHJcbiAgICBzdGF0aWMgY2xhc3MgQnJpZGdlUHJpbnRIdG1sXHJcbiAgICB7XHJcbiAgICAgICAgc3RhdGljIHB1YmxpYyBzdHJpbmcgUHJpbnRUb0h0bWwodGhpcyBSdXN0aWNFeHByIGV4cHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgaHRtbCA9IHN0cmluZy5Gb3JtYXQoXCI8ZGl2IGNsYXNzPVxcXCJleHByLXJlc3VsdFxcXCI+UmVzdWx0OiB7MH08L2Rpdj5cIixleHByLnN0YWNrc1swXS5SZXN1bHRWYWx1ZSk7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGFibGUgd2lkdGg9MTAwJT5cIjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFRhYmxlIEhlYWRcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0aGVhZD5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0aD5TdGFjayBSZWdpc3RlcjwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGggd2lkdGg9NTAlPk9wZXJhdGlvbjwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGggd2lkdGg9MjAlPlJlc3VsdDwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8dGg+VHlwZTwvdGg+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPC90aGVhZD5cIjtcclxuXHJcbiAgICAgICAgICAgIC8vIFRhYmxlIEJvZHlcclxuICAgICAgICAgICAgaHRtbCArPSBcIjx0Ym9keT5cIjtcclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2godmFyIHN0YWNrIGluIGV4cHIuc3RhY2tzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBib29sIGlzRmlyc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgVHlwZSBwcmV2VHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBvYmplY3QgcmVzdWx0VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgZm9yZWFjaCh2YXIgb3BlcmF0aW9uIGluIHN0YWNrLm9wZXJhdGlvbnMpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RhY2sgUmVnaXN0ZXIgY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gc3RyaW5nLkZvcm1hdChcIjx0ZCByb3dzcGFuPSd7MH0nPlJ7MX08L3RkPlwiLHN0YWNrLm9wZXJhdGlvbnMuQ291bnQgKyAxLHN0YWNrLmRpc3BsYXlJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFR5cGUgb3BSZXN1bHRUeXBlID0gb3BlcmF0aW9uLlByZXZpZXdSZXN1bHRUeXBlKHByZXZUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRWYWx1ZSA9IG9wZXJhdGlvbi5FeGVjdXRlKHJlc3VsdFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBPcGVyYXRpb25zIGNvbHVtblxyXG4gICAgICAgICAgICAgICAgICAgIGh0bWwgKz0gc3RyaW5nLkZvcm1hdChcIjx0ZD57MH17MX08L3RkPlwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwob3BlcmF0aW9uLnBhcmFtZXRlciAhPSBudWxsID8gXCIgXCIgKyBvcGVyYXRpb24ucGFyYW1ldGVyIDogXCJcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc3VsdCBjb2x1bW5cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IHN0cmluZy5Gb3JtYXQoXCI8dGQ+UnswfTogezF9PC90ZD5cIixzdGFjay5kaXNwbGF5SWQscmVzdWx0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFR5cGUgY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBzdHJpbmcuRm9ybWF0KFwiPHRkIHN0eWxlPSd3aGl0ZS1zcGFjZTogbm93cmFwJz57MH0oezF9LCB7Mn0pOiB7M308L3RkPlwiLG9wZXJhdGlvbi5HZXRUeXBlKCkuTmFtZSwocHJldlR5cGUhPW51bGw/cHJldlR5cGUuTmFtZTooc3RyaW5nKW51bGwpID8/IFwibnVsbFwiLChvcGVyYXRpb24ucGFyYW1ldGVyICE9IG51bGwgPyBcIiBcIiArIG9wZXJhdGlvbi5wYXJhbWV0ZXJUeXBlLk5hbWUgOiBcIm51bGxcIiksb3BSZXN1bHRUeXBlLk5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPC90cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJldlR5cGUgPSBvcFJlc3VsdFR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaHRtbCArPSBzdHJpbmcuRm9ybWF0KFwiPHRyIHN0eWxlPSdmb250LXdlaWdodDpib2xkJz48dGQ+UmV0dXJuPC90ZD48dGQ+UnswfTogezF9PC90ZD48dGQ+ezJ9PC90ZD48L3RyPlwiLHN0YWNrLmRpc3BsYXlJZCxzdGFjay5SZXN1bHRWYWx1ZSA/PyBcIm51bGxcIiwoZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixzdGFjay5SZXN1bHRWYWx1ZSkhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPG9iamVjdD4oXCJrZXkxXCIpLkdldFR5cGUoKS5OYW1lOihzdHJpbmcpbnVsbCkgPz8gXCJudWxsXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGh0bWwgKz0gXCI8L3RyPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBodG1sICs9IFwiPC90Ym9keT5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjwvdGFibGU+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uRXZhbHVhdG9yc1xue1xuICAgIGNsYXNzIExpdGVyYWwgOiBSdXN0aWNWYWx1ZUV2YWx1YXRvclxuICAgIHtcbiAgICAgICAgb2JqZWN0IHZhbHVlO1xucHVibGljIExpdGVyYWwob2JqZWN0IHZhbHVlKVxyXG57XHJcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEdldFZhbHVlKClcclxue1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59cHVibGljIG92ZXJyaWRlIFR5cGUgR2V0VmFsdWVUeXBlKClcclxue1xyXG4gICAgcmV0dXJuIHZhbHVlLkdldFR5cGUoKTtcclxufXB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcInswfVwiLHZhbHVlKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uRXZhbHVhdG9yc1xyXG57XHJcbiAgICBjbGFzcyBTdGFja1JlZmVyZW5jZSA6IFJ1c3RpY1ZhbHVlRXZhbHVhdG9yXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFJ1c3RpY1N0YWNrIHN0YWNrIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBTdGFja1JlZmVyZW5jZShSdXN0aWNTdGFjayBzdGFjaylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhY2sgPSBzdGFjaztcclxuICAgICAgICB9XHJcbnB1YmxpYyBvdmVycmlkZSBvYmplY3QgR2V0VmFsdWUoKVxyXG57XHJcbiAgICByZXR1cm4gc3RhY2suUmVzdWx0VmFsdWU7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgVHlwZSBHZXRWYWx1ZVR5cGUoKVxyXG57XHJcbiAgICByZXR1cm4gc3RhY2suUHJldmlld1Jlc3VsdFR5cGUoKTtcclxufXB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIlJ7MH1cIixzdGFjay5kaXNwbGF5SWQpO1xyXG59ICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uRXZhbHVhdG9yc1xue1xuICAgIGNsYXNzIFZhcmlhYmxlOiBSdXN0aWNWYWx1ZUV2YWx1YXRvclxuICAgIHtcbiAgICAgICAgUnVzdGljQ29udGV4dCBjb250ZXh0O1xuICAgICAgICBzdHJpbmcgdmFyaWFibGVOYW1lO1xuICAgICAgICBUeXBlIHZhcmlhYmxlVHlwZTtcbiAgICAgICAgcHVibGljIFZhcmlhYmxlKFJ1c3RpY0NvbnRleHQgY29udGV4dCwgc3RyaW5nIHZhcmlhYmxlSWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlTmFtZSA9IHZhcmlhYmxlSWQ7XG4gICAgICAgICAgICB2YXJpYWJsZVR5cGUgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLEdldFZhbHVlKCkpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxvYmplY3Q+KFwia2V5MVwiKS5HZXRUeXBlKCk6KFR5cGUpbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEdldFZhbHVlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG9iamVjdCB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICgoY29udGV4dCE9bnVsbD9jb250ZXh0LnZhcmlhYmxlcy5UcnlHZXRWYWx1ZSh2YXJpYWJsZU5hbWUsIG91dCB2YWx1ZSk6KGJvb2w/KW51bGwpID09IHRydWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiVW5kZWZpbmVkIHZhcmlhYmxlIFxcXCJ7MH1cXFwiXCIsdmFyaWFibGVOYW1lKSk7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgVHlwZSBHZXRWYWx1ZVR5cGUoKVxyXG57XHJcbiAgICByZXR1cm4gdmFyaWFibGVUeXBlO1xyXG59cHVibGljIG92ZXJyaWRlIHN0cmluZyBUb1N0cmluZygpXHJcbntcclxuICAgIHJldHVybiB2YXJpYWJsZU5hbWU7XHJcbn0gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLk9wZXJhdGlvbnNcclxue1xyXG4gICAgY2xhc3MgQWRkIDogUnVzdGljT3BlcmF0aW9uXHJcbiAgICB7XHJcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xyXG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmMoc3RvcmVkLCBwYXJhbWV0ZXJWYWx1ZSk7XHJcbn1wcm90ZWN0ZWQgb3ZlcnJpZGUgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKVxyXG57XHJcbiAgICByZXR1cm4gRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uUnVzdGljT3BlcmF0aW9uLlByaW9yaXR5LkFkZFN1YjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguQWRkW3R5cGVvZihkb3VibGUpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGZsb2F0KSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihmbG9hdCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5BZGRbdHlwZW9mKGZsb2F0KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGZsb2F0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGludCkgJiYgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoaW50KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLkFkZFt0eXBlb2YoaW50KV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGludCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKFwiQ291bGQgbm90IGluZmVyIHRoZSByZXN1bHRpbmcgdHlwZVwiKTtcclxuICAgICAgICB9XHJcbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgKyB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXG57XG4gICAgY2xhc3MgRGl2IDogUnVzdGljT3BlcmF0aW9uXG4gICAge1xuICAgICAgICBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+IGZ1bmM7XG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmMoc3RvcmVkLCBwYXJhbWV0ZXJWYWx1ZSk7XHJcbn1wcm90ZWN0ZWQgb3ZlcnJpZGUgUHJpb3JpdHkgR2V0UHJpb3JpdHkoKVxyXG57XHJcbiAgICByZXR1cm4gRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uUnVzdGljT3BlcmF0aW9uLlByaW9yaXR5Lk11bERpdjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihkb3VibGUpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGRvdWJsZSkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLkRpdlt0eXBlb2YoZG91YmxlKV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihkb3VibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihmbG9hdCkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZmxvYXQpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5EaXZbdHlwZW9mKGZsb2F0KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihmbG9hdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGludCkgJiYgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoaW50KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguRGl2W3R5cGVvZihpbnQpXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGludCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKFwiQ291bGQgbm90IGluZmVyIHRoZSByZXN1bHRpbmcgdHlwZVwiKTtcbiAgICAgICAgfVxucHVibGljIG92ZXJyaWRlIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiAvIHswfVwiLGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkxXCIscGFyYW1ldGVyKSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8UnVzdGljVmFsdWVFdmFsdWF0b3I+KFwia2V5MVwiKS5Ub1N0cmluZygpOihzdHJpbmcpbnVsbCk7XHJcbn0gICAgfVxufVxuIiwidXNpbmcgU3lzdGVtO1xuXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uT3BlcmF0aW9uc1xue1xuICAgIGNsYXNzIE11bCA6IFJ1c3RpY09wZXJhdGlvblxuICAgIHtcbiAgICAgICAgRnVuYzxvYmplY3QsIG9iamVjdCwgb2JqZWN0PiBmdW5jO1xucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgcGFyYW1ldGVyVmFsdWUpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5NdWxEaXY7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5NdWxbdHlwZW9mKGRvdWJsZSldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZmxvYXQpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGZsb2F0KSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguTXVsW3R5cGVvZihmbG9hdCldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZmxvYXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihpbnQpICYmIHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGludCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLk11bFt0eXBlb2YoaW50KV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihcIkNvdWxkIG5vdCBpbmZlciB0aGUgcmVzdWx0aW5nIHR5cGVcIik7XG4gICAgICAgIH1cbnB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9FeHByZXNzaW9uU3RyaW5nKClcclxue1xyXG4gICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCIgKiB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXHJcbntcclxuICAgIGNsYXNzIFBvdyA6IFJ1c3RpY09wZXJhdGlvblxyXG4gICAge1xyXG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIE1hdGguUG93KENvbnZlcnQuVG9Eb3VibGUoc3RvcmVkKSwgQ29udmVydC5Ub0RvdWJsZShwYXJhbWV0ZXJWYWx1ZSkpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5Qb3c7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIHR5cGVvZihkb3VibGUpO1xyXG59I2lmIFVOSVRZX0VESVRPUlxyXG4gICAgICAgIFByZXZpZXdSZXN1bHRUeXBlIHNob3VsZCBjb25zaWRlciBmbG9hdCBhbmQgZG91YmxlIHdpdGggTWF0aGYuUG93LlxyXG4jZW5kaWZcclxucHVibGljIG92ZXJyaWRlIGJvb2wgSGFzUmlnaHRUb0xlZnRQcmVjZWRlbmNlKClcclxue1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiICoqICh7MH0pXCIsZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLlRvU3RyaW5nKCk6KHN0cmluZyludWxsKTtcclxufSAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xuXG5uYW1lc3BhY2UgRXhwcmVzc2lvblN0YWNrLlJ1c3RpY0V4cHJlc3Npb24uT3BlcmF0aW9ucy5QcmVmaXhVbmFyeVxue1xuICAgIGNsYXNzIE5lZ2F0aXZlIDogUnVzdGljT3BlcmF0aW9uXG4gICAge1xuICAgICAgICBGdW5jPG9iamVjdCwgb2JqZWN0LCBvYmplY3Q+IGZ1bmM7XG5wdWJsaWMgb3ZlcnJpZGUgb2JqZWN0IEV4ZWN1dGUob2JqZWN0IHN0b3JlZClcclxue1xyXG4gICAgcmV0dXJuIGZ1bmMoc3RvcmVkLCBudWxsKTtcclxufXByb3RlY3RlZCBvdmVycmlkZSBQcmlvcml0eSBHZXRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5SdXN0aWNPcGVyYXRpb24uUHJpb3JpdHkuUHJlZml4VW5hcnk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGRvdWJsZSkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZG91YmxlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLk5lZ2F0aXZlW3R5cGVvZihkb3VibGUpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZG91YmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGZsb2F0KSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihmbG9hdCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5OZWdhdGl2ZVt0eXBlb2YoZmxvYXQpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoZmxvYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLk5lZ2F0aXZlW3R5cGVvZihpbnQpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YoaW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxucHVibGljIG92ZXJyaWRlIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiAqLTEgezB9XCIsKHBhcmFtZXRlciAhPSBudWxsID8gcGFyYW1ldGVyLkdldFR5cGUoKS5OYW1lIDogXCJudWxsXCIpKTtcclxufSAgICB9XG59XG4iLCJ1c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zLlByZWZpeFVuYXJ5XG57XG4gICAgY2xhc3MgUG9zaXRpdmUgOiBSdXN0aWNPcGVyYXRpb25cbiAgICB7XG4gICAgICAgIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4gZnVuYztcbnB1YmxpYyBvdmVycmlkZSBvYmplY3QgRXhlY3V0ZShvYmplY3Qgc3RvcmVkKVxyXG57XHJcbiAgICByZXR1cm4gZnVuYyhzdG9yZWQsIG51bGwpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5QcmVmaXhVbmFyeTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZG91YmxlKSB8fCBwYXJhbWV0ZXJUeXBlID09IHR5cGVvZihkb3VibGUpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguUG9zaXRpdmVbdHlwZW9mKGRvdWJsZSldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihkb3VibGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGluY29taW5nU3RvcmVkVHlwZSA9PSB0eXBlb2YoZmxvYXQpIHx8IHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGZsb2F0KSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLlBvc2l0aXZlW3R5cGVvZihmbG9hdCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihmbG9hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguUG9zaXRpdmVbdHlwZW9mKGludCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiXCIpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXG57XG4gICAgY2xhc3MgU2V0IDogUnVzdGljT3BlcmF0aW9uXG4gICAge1xucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBwYXJhbWV0ZXJWYWx1ZTtcclxufXByb3RlY3RlZCBvdmVycmlkZSBQcmlvcml0eSBHZXRQcmlvcml0eSgpXHJcbntcclxuICAgIHJldHVybiBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5SdXN0aWNPcGVyYXRpb24uUHJpb3JpdHkuSWdub3JlZDtcclxufXB1YmxpYyBvdmVycmlkZSBUeXBlIFByZXZpZXdSZXN1bHRUeXBlKFR5cGUgaW5jb21pbmdTdG9yZWRUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gcGFyYW1ldGVyVHlwZTtcclxufXB1YmxpYyBvdmVycmlkZSBib29sIEhhc1JpZ2h0VG9MZWZ0UHJlY2VkZW5jZSgpXHJcbntcclxuICAgIHJldHVybiB0cnVlO1xyXG59cHVibGljIG92ZXJyaWRlIHN0cmluZyBUb0V4cHJlc3Npb25TdHJpbmcoKVxyXG57XHJcbiAgICByZXR1cm4gc3RyaW5nLkZvcm1hdChcIiB7MH1cIixnbG9iYWw6OkJyaWRnZS5TY3JpcHQuVG9UZW1wKFwia2V5MVwiLHBhcmFtZXRlcikhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21UZW1wPFJ1c3RpY1ZhbHVlRXZhbHVhdG9yPihcImtleTFcIikuVG9TdHJpbmcoKTooc3RyaW5nKW51bGwpO1xyXG59ICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBFeHByZXNzaW9uU3RhY2suUnVzdGljRXhwcmVzc2lvbi5PcGVyYXRpb25zXHJcbntcclxuICAgIGNsYXNzIFN1YiA6IFJ1c3RpY09wZXJhdGlvblxyXG4gICAge1xyXG4gICAgICAgIEZ1bmM8b2JqZWN0LCBvYmplY3QsIG9iamVjdD4gZnVuYztcclxucHVibGljIG92ZXJyaWRlIG9iamVjdCBFeGVjdXRlKG9iamVjdCBzdG9yZWQpXHJcbntcclxuICAgIHJldHVybiBmdW5jKHN0b3JlZCwgcGFyYW1ldGVyVmFsdWUpO1xyXG59cHJvdGVjdGVkIG92ZXJyaWRlIFByaW9yaXR5IEdldFByaW9yaXR5KClcclxue1xyXG4gICAgcmV0dXJuIEV4cHJlc3Npb25TdGFjay5SdXN0aWNFeHByZXNzaW9uLlJ1c3RpY09wZXJhdGlvbi5Qcmlvcml0eS5BZGRTdWI7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgVHlwZSBQcmV2aWV3UmVzdWx0VHlwZShUeXBlIGluY29taW5nU3RvcmVkVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChpbmNvbWluZ1N0b3JlZFR5cGUgPT0gdHlwZW9mKGRvdWJsZSkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZG91YmxlKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZnVuYyA9IFByb3ZpZGVycy5Db21tb25NYXRoLlN1Ylt0eXBlb2YoZG91YmxlKV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mKGRvdWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihmbG9hdCkgfHwgcGFyYW1ldGVyVHlwZSA9PSB0eXBlb2YoZmxvYXQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmdW5jID0gUHJvdmlkZXJzLkNvbW1vbk1hdGguU3ViW3R5cGVvZihmbG9hdCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihmbG9hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaW5jb21pbmdTdG9yZWRUeXBlID09IHR5cGVvZihpbnQpICYmIHBhcmFtZXRlclR5cGUgPT0gdHlwZW9mKGludCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMgPSBQcm92aWRlcnMuQ29tbW9uTWF0aC5TdWJbdHlwZW9mKGludCldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZihpbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihcIkNvdWxkIG5vdCBpbmZlciB0aGUgcmVzdWx0aW5nIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvRXhwcmVzc2lvblN0cmluZygpXHJcbntcclxuICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiIC0gezB9XCIsZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixwYXJhbWV0ZXIpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxSdXN0aWNWYWx1ZUV2YWx1YXRvcj4oXCJrZXkxXCIpLlRvU3RyaW5nKCk6KHN0cmluZyludWxsKTtcclxufSAgICB9XHJcbn1cclxuIl0KfQo=
