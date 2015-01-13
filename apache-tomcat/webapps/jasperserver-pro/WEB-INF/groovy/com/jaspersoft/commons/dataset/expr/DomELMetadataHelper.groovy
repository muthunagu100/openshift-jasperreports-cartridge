package com.jaspersoft.commons.dataset.expr

class DomELMetadataHelper implements FunctionFilter, ExpressionValidator {
		 
	List<OperatorDefinition> filter(List<OperatorDefinition> origList) {
		origList.findAll { OperatorDefinition opDef -> opDef.testProperty('inAvailableFunctions')}
	}
	
	List<String> getValidAggregateFunctions(Expression expr) {
		Set<String> aggList = new LinkedHashSet<String>()
		if (! ExpressionEvaluator.isAggregate(expr)) {
			if (TypeUtil.isNumeric(expr.javaType)) {
				aggList.addAll(["Sum", "Average", "WeightedAverage", "Max", "Min", "StdDevP", "StdDevS",
                                 "Median", "Range"])
			//} else if (TypeUtil.getSuperType(expr.javaType) in ["date", "timestamp", "time"]) {
			//	aggList.addAll(["Max", "Min", "Mode", "Median", "Range", "RangeMinutes", "RangeHours", "RangeDays",
            //            "RangeWeeks", "RangeMonths", "RangeQuarters", "RangeSemi", "RangeYears"])
			}
            //
            // http://bugzilla.jaspersoft.com/show_bug.cgi?id=37240
            // Mode applies to ALL datatypes
            //
			aggList.addAll(["CountAll", "CountDistinct", "Mode"])
		} else if (ExpressionEvaluator.isValidAggregate(expr)) {
			aggList.add("AggregateFormula");
		}
        // scalar and aggregate Date Time types can have Date Time summaries
        if (TypeUtil.getSuperType(expr.javaType) in ["date", "timestamp", "time"]) {
            aggList.addAll(["Max", "Min", "Mode", "Median", "RangeMinutes", "RangeHours", "RangeDays",
                            "RangeWeeks", "RangeMonths", "RangeQuarters", "RangeSemis", "RangeYears"])
        }
		aggList.addAll(["Custom", "None"])
		return aggList as List<String>
	}

	/*
	 * rollup xform
	 * sum: sum(sum)
	 * max: max(max)
	 * min: min(min)
	 * count: sum(count)
	 * distinctCount: bzzt!
	 * average: sum(sum) / sum(count)
	 * range: max(max) - min(min)
	 * weightedAverage: weightedAverage(sum1, sum2)
	 * 
	 */
	@Override
	public String getDefaultAggregateFunction(Expression expr) {
		if (! ExpressionEvaluator.isAggregate(expr)) {
			if (TypeUtil.isNumeric(expr.javaType)) {
				return "Sum"
			} else {
				return "CountAll"
			}
		} else if (ExpressionEvaluator.isValidAggregate(expr)) {
            // we used to have a "Same" function which meant that agg expression was the same as expression.
            // instead of doing that, we set it to Custom and init the agg expression from expression.
            // see MetadataService.doValidate()
            return "AggregateFormula"
		} else {
            return "None"
		}
	}

	// TODO aggregate error types, including custom summary validation
	@Override
	public Expression getAggregateExpression(ExpressionEvaluator eval, Expression expression, String aggregateFunction, String aggregateArg) {
		if (! getValidAggregateFunctions(expression).contains(aggregateFunction)) {
			// throw something
		}
		switch (aggregateFunction) {
			case "Custom":
				// should not be called, because agg expression is user-supplied, not generated
				return
            case "AggregateFormula":
                return expression
			case "None":
				return eval.getLiteral(null)
			case "WeightedAverage":
			// test for arg: non-null, valid field
				def weightVar = eval.getVariable(aggregateArg)
				return eval.getOperator(aggregateFunction, expression, weightVar)
            //
            // http://bugzilla.jaspersoft.com/show_bug.cgi?id=37334
            //
            // special case handling for CountAll summary on CONSTANT fields
            // for those do the no-arg CountAll()
            //
            case "CountAll":
              def var = null;
              if (aggregateArg != null) {
                var = eval.getVariable(aggregateArg);
              }
              if (var == null) {
                return eval.getOperator(aggregateFunction);
              }
              if (eval.isConstantExpression(var)) {
                return eval.getOperator(aggregateFunction);   // use no-arg CountAll for Constant args
              }
              // else fall through to default

			default:
				// generate other aggs 
				// HybridAggregateTransformer still handles divide, expands the calc fields and splits sql/mem
				return eval.getOperator(aggregateFunction, expression)
		}
	}
	
	public void checkFunctionsAndArguments(ExpressionEvaluator eval, Expression expression) throws FieldException {
		final def errList = []
		new ExpressionWalker() {
			void operator(Operator op) {
				// test for invalid function
				if (op.definition.testProperty("invalid")) {
					throw new FieldException(FieldException.Type.INVALID_FUNCTION, op.name)
				}
				op.definition.validate(eval, op)
				// recurse to the operators
				for (Expression operand : op.getOperands()) {
					walk(operand);
				}
			}
		}.walk(expression)
	}
	public void checkCircularReferences(ExpressionEvaluator eval, String fieldName, Expression expression) throws FieldException {
		// see if you end up with a self-reference
		new ExpressionTransformer(eval) {
			Expression getVariable(Variable v) {
				// bzzt, found the cycle
				if (v.field.name == fieldName) {
					throw new FieldException(FieldException.Type.CIRCULAR_REFERENCE, fieldName, expression)
				}
				// expand calc fields, otherwise just return the var
				if (v.field.expression) {
					return get(eval.parseExpression(v.field.expression))
				}
				return v
			}
		}.get(expression)
	}
	
    // hook to allow setting of formats
    String getDefaultFormat(ExpressionEvaluator eval, Expression expression) {
        null
    }
    
    void p(String s) {
        System.err.println("DomELMetadataHelper: "+s);
    }
    
    def methodMissing(String func, args) {
        null
    }

    public Object evalFormula(ExpressionEvaluator eval, String exprString, Object[] args) {
        Operator expr = eval.parseExpression(exprString)
        def func = expr.definition.name

        // http://bugzilla.jaspersoft.com/show_bug.cgi?id=37631
        //   DEBUG print got into production code.   Disable it
        //
        //p("$func $args")

        "$func"(*args)
    }
    def add(long[] args) { long total = 0; args.each { if (it != null) total += it }; return total }
    
    def add(double[] args) { double total = 0; args.each { if (it != null) total += it }; return total }
    
    def add(Object[] args) { BigDecimal total = 0; args.each { if (it != null) total += it }; return total }
    
    def subtract(arg1, arg2) { (arg1 ?: 0) - (arg2 ?: 0) }
    
    def multiply(long[] args) { long total = 1; args.each { total *= (it ?: 0) }; return total }
    
    def multiply(double[] args) { double total = 1; args.each { total *= (it ?: 0) }; return total }
    
    def multiply(Object[] args) { BigDecimal total = 1; args.each { total *= (it ?: 0) }; return total }
    
      // don't do separate versions of division because Groovy method resolution is flakey,
      // but we do need to handle BigDecimal separately
    def divide(arg1, arg2) {
        // if either arg is null, or if denominator is 0, return null
        def result
        if (arg1 == null || arg2 == null) {
            result = null
        } else if (arg2 == 0) {
          result = null
        } else if (arg1 instanceof BigDecimal) {
          result = arg1.divide(arg2, MathContext.DECIMAL64)
        } else {
          result = arg1 / arg2
        }
        result
    }
}