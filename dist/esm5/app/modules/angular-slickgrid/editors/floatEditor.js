/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Constants } from '../constants';
import { KeyCode } from './../models/index';
/** @type {?} */
var defaultDecimalPlaces = 0;
/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
var /*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
FloatEditor = /** @class */ (function () {
    function FloatEditor(args) {
        this.args = args;
        this.init();
    }
    Object.defineProperty(FloatEditor.prototype, "columnDef", {
        /** Get Column Definition object */
        get: /**
         * Get Column Definition object
         * @return {?}
         */
        function () {
            return this.args && this.args.column || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FloatEditor.prototype, "columnEditor", {
        /** Get Column Editor object */
        get: /**
         * Get Column Editor object
         * @return {?}
         */
        function () {
            return this.columnDef && this.columnDef.internalColumnEditor || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FloatEditor.prototype, "hasAutoCommitEdit", {
        get: /**
         * @return {?}
         */
        function () {
            return this.args.grid.getOptions().autoCommitEdit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FloatEditor.prototype, "validator", {
        /** Get the Validator function, can be passed in Editor property or Column Definition */
        get: /**
         * Get the Validator function, can be passed in Editor property or Column Definition
         * @return {?}
         */
        function () {
            return this.columnEditor.validator || this.columnDef.validator;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    FloatEditor.prototype.init = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var fieldId = this.columnDef && this.columnDef.id;
        this.$input = $("<input type=\"number\" class=\"editor-text editor-" + fieldId + "\" step=\"" + this.getInputDecimalSteps() + "\" />")
            .appendTo(this.args.container)
            .on('keydown.nav', function (e) {
            if (e.keyCode === KeyCode.LEFT || e.keyCode === KeyCode.RIGHT) {
                e.stopImmediatePropagation();
            }
        });
        // the lib does not get the focus out event for some reason
        // so register it here
        if (this.hasAutoCommitEdit) {
            this.$input.on('focusout', function () { return _this.save(); });
        }
        setTimeout(function () {
            _this.$input.focus().select();
        }, 50);
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.destroy = /**
     * @return {?}
     */
    function () {
        this.$input.remove();
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.focus = /**
     * @return {?}
     */
    function () {
        this.$input.focus();
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.getColumnEditor = /**
     * @return {?}
     */
    function () {
        return this.args && this.args.column && this.args.column.internalColumnEditor && this.args.column.internalColumnEditor;
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.getDecimalPlaces = /**
     * @return {?}
     */
    function () {
        // returns the number of fixed decimal places or null
        /** @type {?} */
        var rtn = (this.columnEditor.params && this.columnEditor.params.hasOwnProperty('decimalPlaces')) ? this.columnEditor.params.decimalPlaces : undefined;
        if (rtn === undefined) {
            rtn = defaultDecimalPlaces;
        }
        return (!rtn && rtn !== 0 ? null : rtn);
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.getInputDecimalSteps = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var decimals = this.getDecimalPlaces();
        /** @type {?} */
        var zeroString = '';
        for (var i = 1; i < decimals; i++) {
            zeroString += '0';
        }
        if (decimals > 0) {
            return "0." + zeroString + "1";
        }
        return '1';
    };
    /**
     * @param {?} item
     * @return {?}
     */
    FloatEditor.prototype.loadValue = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        this.defaultValue = item[this.columnDef.field];
        /** @type {?} */
        var decPlaces = this.getDecimalPlaces();
        if (decPlaces !== null
            && (this.defaultValue || this.defaultValue === 0)
            && this.defaultValue.toFixed) {
            this.defaultValue = this.defaultValue.toFixed(decPlaces);
        }
        this.$input.val(this.defaultValue);
        this.$input[0].defaultValue = this.defaultValue;
        this.$input.select();
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.serializeValue = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var rtn = parseFloat(this.$input.val()) || 0;
        /** @type {?} */
        var decPlaces = this.getDecimalPlaces();
        if (decPlaces !== null
            && (rtn || rtn === 0)
            && rtn.toFixed) {
            rtn = parseFloat(rtn.toFixed(decPlaces));
        }
        return rtn;
    };
    /**
     * @param {?} item
     * @param {?} state
     * @return {?}
     */
    FloatEditor.prototype.applyValue = /**
     * @param {?} item
     * @param {?} state
     * @return {?}
     */
    function (item, state) {
        item[this.columnDef.field] = state;
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.isValueChanged = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var elmValue = this.$input.val();
        return (!(elmValue === '' && this.defaultValue === null)) && (elmValue !== this.defaultValue);
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.save = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var validation = this.validate();
        if (validation && validation.valid) {
            if (this.hasAutoCommitEdit) {
                this.args.grid.getEditorLock().commitCurrentEdit();
            }
            else {
                this.args.commitChanges();
            }
        }
    };
    /**
     * @return {?}
     */
    FloatEditor.prototype.validate = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var elmValue = this.$input.val();
        /** @type {?} */
        var floatNumber = !isNaN((/** @type {?} */ (elmValue))) ? parseFloat(elmValue) : null;
        /** @type {?} */
        var decPlaces = this.getDecimalPlaces();
        /** @type {?} */
        var minValue = this.columnEditor.minValue;
        /** @type {?} */
        var maxValue = this.columnEditor.maxValue;
        /** @type {?} */
        var errorMsg = this.columnEditor.errorMessage;
        /** @type {?} */
        var mapValidation = {
            '{{minValue}}': minValue,
            '{{maxValue}}': maxValue,
            '{{minDecimal}}': 0,
            '{{maxDecimal}}': decPlaces
        };
        if (this.validator) {
            /** @type {?} */
            var validationResults = this.validator(elmValue, this.args);
            if (!validationResults.valid) {
                return validationResults;
            }
        }
        else if (isNaN((/** @type {?} */ (elmValue))) || (decPlaces === 0 && !/^[-+]?(\d+(\.)?(\d)*)$/.test(elmValue))) {
            // when decimal value is 0 (which is the default), we accept 0 or more decimal values
            return {
                valid: false,
                msg: errorMsg || Constants.VALIDATION_EDITOR_VALID_NUMBER
            };
        }
        else if (minValue !== undefined && maxValue !== undefined && floatNumber !== null && (floatNumber < minValue || floatNumber > maxValue)) {
            // MIN & MAX Values provided
            // when decimal value is bigger than 0, we only accept the decimal values as that value set
            // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
            return {
                valid: false,
                msg: errorMsg || Constants.VALIDATION_EDITOR_NUMBER_BETWEEN.replace(/{{minValue}}|{{maxValue}}/gi, function (matched) { return mapValidation[matched]; })
            };
        }
        else if (minValue !== undefined && floatNumber !== null && floatNumber <= minValue) {
            // MIN VALUE ONLY
            // when decimal value is bigger than 0, we only accept the decimal values as that value set
            // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
            return {
                valid: false,
                msg: errorMsg || Constants.VALIDATION_EDITOR_NUMBER_MIN.replace(/{{minValue}}/gi, function (matched) { return mapValidation[matched]; })
            };
        }
        else if (maxValue !== undefined && floatNumber !== null && floatNumber >= maxValue) {
            // MAX VALUE ONLY
            // when decimal value is bigger than 0, we only accept the decimal values as that value set
            // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
            return {
                valid: false,
                msg: errorMsg || Constants.VALIDATION_EDITOR_NUMBER_MAX.replace(/{{maxValue}}/gi, function (matched) { return mapValidation[matched]; })
            };
        }
        else if ((decPlaces > 0 && !new RegExp("^(\\d*(\\.)?(\\d){0," + decPlaces + "})$").test(elmValue))) {
            // when decimal value is bigger than 0, we only accept the decimal values as that value set
            // for example if we set decimalPlaces to 2, we will only accept numbers between 0 and 2 decimals
            return {
                valid: false,
                msg: errorMsg || Constants.VALIDATION_EDITOR_DECIMAL_BETWEEN.replace(/{{minDecimal}}|{{maxDecimal}}/gi, function (matched) { return mapValidation[matched]; })
            };
        }
        return {
            valid: true,
            msg: null
        };
    };
    return FloatEditor;
}());
/*
 * An example of a 'detached' editor.
 * KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
 */
export { FloatEditor };
if (false) {
    /** @type {?} */
    FloatEditor.prototype.$input;
    /** @type {?} */
    FloatEditor.prototype.defaultValue;
    /**
     * @type {?}
     * @private
     */
    FloatEditor.prototype.args;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvYXRFZGl0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLXNsaWNrZ3JpZC8iLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2FuZ3VsYXItc2xpY2tncmlkL2VkaXRvcnMvZmxvYXRFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUEwRCxPQUFPLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7SUFLOUYsb0JBQW9CLEdBQUcsQ0FBQzs7Ozs7QUFNOUI7Ozs7O0lBSUUscUJBQW9CLElBQVM7UUFBVCxTQUFJLEdBQUosSUFBSSxDQUFLO1FBQzNCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFHRCxzQkFBSSxrQ0FBUztRQURiLG1DQUFtQzs7Ozs7UUFDbkM7WUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQzdDLENBQUM7OztPQUFBO0lBR0Qsc0JBQUkscUNBQVk7UUFEaEIsK0JBQStCOzs7OztRQUMvQjtZQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixJQUFJLEVBQUUsQ0FBQztRQUNyRSxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDBDQUFpQjs7OztRQUFyQjtZQUNFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsY0FBYyxDQUFDO1FBQ3BELENBQUM7OztPQUFBO0lBR0Qsc0JBQUksa0NBQVM7UUFEYix3RkFBd0Y7Ozs7O1FBQ3hGO1lBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUNqRSxDQUFDOzs7T0FBQTs7OztJQUVELDBCQUFJOzs7SUFBSjtRQUFBLGlCQW1C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Q0FBQyxFQUF0QixDQUFzQixDQUFDO2FBQ3ZILENBQUM7U0FDSDthQUFNLElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxXQUFXLEtBQUssSUFBSSxJQUFJLFdBQVcsSUFBSSxRQUFRLEVBQUU7WUFDcEYsaUJBQWlCO1lBQ2pCLDJGQUEyRjtZQUMzRixpR0FBaUc7WUFDakcsT0FBTztnQkFDTCxLQUFLLEVBQUUsS0FBSztnQkFDWixHQUFHLEVBQUUsUUFBUSxJQUFJLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsVUFBQyxPQUFPLElBQUssT0FBQSxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUM7YUFDdkgsQ0FBQztTQUNIO2FBQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyx5QkFBdUIsU0FBUyxRQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUMvRiwyRkFBMkY7WUFDM0YsaUdBQWlHO1lBQ2pHLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osR0FBRyxFQUFFLFFBQVEsSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxFQUFFLFVBQUMsT0FBTyxJQUFLLE9BQUEsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUF0QixDQUFzQixDQUFDO2FBQzdJLENBQUM7U0FDSDtRQUVELE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSTtZQUNYLEdBQUcsRUFBRSxJQUFJO1NBQ1YsQ0FBQztJQUNKLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFqTUQsSUFpTUM7Ozs7Ozs7O0lBaE1DLDZCQUFZOztJQUNaLG1DQUFrQjs7Ozs7SUFFTiwyQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgQ29sdW1uLCBFZGl0b3IsIEVkaXRvclZhbGlkYXRvciwgRWRpdG9yVmFsaWRhdG9yT3V0cHV0LCBLZXlDb2RlIH0gZnJvbSAnLi8uLi9tb2RlbHMvaW5kZXgnO1xuXG4vLyB1c2luZyBleHRlcm5hbCBub24tdHlwZWQganMgbGlicmFyaWVzXG5kZWNsYXJlIHZhciAkOiBhbnk7XG5cbmNvbnN0IGRlZmF1bHREZWNpbWFsUGxhY2VzID0gMDtcblxuLypcbiAqIEFuIGV4YW1wbGUgb2YgYSAnZGV0YWNoZWQnIGVkaXRvci5cbiAqIEtleURvd24gZXZlbnRzIGFyZSBhbHNvIGhhbmRsZWQgdG8gcHJvdmlkZSBoYW5kbGluZyBmb3IgVGFiLCBTaGlmdC1UYWIsIEVzYyBhbmQgQ3RybC1FbnRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEZsb2F0RWRpdG9yIGltcGxlbWVudHMgRWRpdG9yIHtcbiAgJGlucHV0OiBhbnk7XG4gIGRlZmF1bHRWYWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXJnczogYW55KSB7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvKiogR2V0IENvbHVtbiBEZWZpbml0aW9uIG9iamVjdCAqL1xuICBnZXQgY29sdW1uRGVmKCk6IENvbHVtbiB7XG4gICAgcmV0dXJuIHRoaXMuYXJncyAmJiB0aGlzLmFyZ3MuY29sdW1uIHx8IHt9O1xuICB9XG5cbiAgLyoqIEdldCBDb2x1bW4gRWRpdG9yIG9iamVjdCAqL1xuICBnZXQgY29sdW1uRWRpdG9yKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmLmludGVybmFsQ29sdW1uRWRpdG9yIHx8IHt9O1xuICB9XG5cbiAgZ2V0IGhhc0F1dG9Db21taXRFZGl0KCkge1xuICAgIHJldHVybiB0aGlzLmFyZ3MuZ3JpZC5nZXRPcHRpb25zKCkuYXV0b0NvbW1pdEVkaXQ7XG4gIH1cblxuICAvKiogR2V0IHRoZSBWYWxpZGF0b3IgZnVuY3Rpb24sIGNhbiBiZSBwYXNzZWQgaW4gRWRpdG9yIHByb3BlcnR5IG9yIENvbHVtbiBEZWZpbml0aW9uICovXG4gIGdldCB2YWxpZGF0b3IoKTogRWRpdG9yVmFsaWRhdG9yIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5FZGl0b3IudmFsaWRhdG9yIHx8IHRoaXMuY29sdW1uRGVmLnZhbGlkYXRvcjtcbiAgfVxuXG4gIGluaXQoKTogdm9pZCB7XG4gICAgY29uc3QgZmllbGRJZCA9IHRoaXMuY29sdW1uRGVmICYmIHRoaXMuY29sdW1uRGVmLmlkO1xuICAgIHRoaXMuJGlucHV0ID0gJChgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBjbGFzcz1cImVkaXRvci10ZXh0IGVkaXRvci0ke2ZpZWxkSWR9XCIgc3RlcD1cIiR7dGhpcy5nZXRJbnB1dERlY2ltYWxTdGVwcygpfVwiIC8+YClcbiAgICAgIC5hcHBlbmRUbyh0aGlzLmFyZ3MuY29udGFpbmVyKVxuICAgICAgLm9uKCdrZXlkb3duLm5hdicsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IEtleUNvZGUuTEVGVCB8fCBlLmtleUNvZGUgPT09IEtleUNvZGUuUklHSFQpIHtcbiAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIC8vIHRoZSBsaWIgZG9lcyBub3QgZ2V0IHRoZSBmb2N1cyBvdXQgZXZlbnQgZm9yIHNvbWUgcmVhc29uXG4gICAgLy8gc28gcmVnaXN0ZXIgaXQgaGVyZVxuICAgIGlmICh0aGlzLmhhc0F1dG9Db21taXRFZGl0KSB7XG4gICAgICB0aGlzLiRpbnB1dC5vbignZm9jdXNvdXQnLCAoKSA9PiB0aGlzLnNhdmUoKSk7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLiRpbnB1dC5mb2N1cygpLnNlbGVjdCgpO1xuICAgIH0sIDUwKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kaW5wdXQucmVtb3ZlKCk7XG4gIH1cblxuICBmb2N1cygpIHtcbiAgICB0aGlzLiRpbnB1dC5mb2N1cygpO1xuICB9XG5cbiAgZ2V0Q29sdW1uRWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmFyZ3MgJiYgdGhpcy5hcmdzLmNvbHVtbiAmJiB0aGlzLmFyZ3MuY29sdW1uLmludGVybmFsQ29sdW1uRWRpdG9yICYmIHRoaXMuYXJncy5jb2x1bW4uaW50ZXJuYWxDb2x1bW5FZGl0b3I7XG4gIH1cblxuICBnZXREZWNpbWFsUGxhY2VzKCk6IG51bWJlciB7XG4gICAgLy8gcmV0dXJucyB0aGUgbnVtYmVyIG9mIGZpeGVkIGRlY2ltYWwgcGxhY2VzIG9yIG51bGxcbiAgICBsZXQgcnRuID0gKHRoaXMuY29sdW1uRWRpdG9yLnBhcmFtcyAmJiB0aGlzLmNvbHVtbkVkaXRvci5wYXJhbXMuaGFzT3duUHJvcGVydHkoJ2RlY2ltYWxQbGFjZXMnKSkgPyB0aGlzLmNvbHVtbkVkaXRvci5wYXJhbXMuZGVjaW1hbFBsYWNlcyA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChydG4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcnRuID0gZGVmYXVsdERlY2ltYWxQbGFjZXM7XG4gICAgfVxuICAgIHJldHVybiAoIXJ0biAmJiBydG4gIT09IDAgPyBudWxsIDogcnRuKTtcbiAgfVxuXG4gIGdldElucHV0RGVjaW1hbFN0ZXBzKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZGVjaW1hbHMgPSB0aGlzLmdldERlY2ltYWxQbGFjZXMoKTtcbiAgICBsZXQgemVyb1N0cmluZyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgZGVjaW1hbHM7IGkrKykge1xuICAgICAgemVyb1N0cmluZyArPSAnMCc7XG4gICAgfVxuXG4gICAgaWYgKGRlY2ltYWxzID4gMCkge1xuICAgICAgcmV0dXJuIGAwLiR7emVyb1N0cmluZ30xYDtcbiAgICB9XG4gICAgcmV0dXJuICcxJztcbiAgfVxuXG4gIGxvYWRWYWx1ZShpdGVtOiBhbnkpIHtcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGl0ZW1bdGhpcy5jb2x1bW5EZWYuZmllbGRdO1xuXG4gICAgY29uc3QgZGVjUGxhY2VzID0gdGhpcy5nZXREZWNpbWFsUGxhY2VzKCk7XG4gICAgaWYgKGRlY1BsYWNlcyAhPT0gbnVsbFxuICAgICAgJiYgKHRoaXMuZGVmYXVsdFZhbHVlIHx8IHRoaXMuZGVmYXVsdFZhbHVlID09PSAwKVxuICAgICAgJiYgdGhpcy5kZWZhdWx0VmFsdWUudG9GaXhlZCkge1xuICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB0aGlzLmRlZmF1bHRWYWx1ZS50b0ZpeGVkKGRlY1BsYWNlcyk7XG4gICAgfVxuXG4gICAgdGhpcy4kaW5wdXQudmFsKHRoaXMuZGVmYXVsdFZhbHVlKTtcbiAgICB0aGlzLiRpbnB1dFswXS5kZWZhdWx0VmFsdWUgPSB0aGlzLmRlZmF1bHRWYWx1ZTtcbiAgICB0aGlzLiRpbnB1dC5zZWxlY3QoKTtcbiAgfVxuXG4gIHNlcmlhbGl6ZVZhbHVlKCkge1xuICAgIGxldCBydG4gPSBwYXJzZUZsb2F0KHRoaXMuJGlucHV0LnZhbCgpKSB8fCAwO1xuICAgIGNvbnN0IGRlY1BsYWNlcyA9IHRoaXMuZ2V0RGVjaW1hbFBsYWNlcygpO1xuICAgIGlmIChkZWNQbGFjZXMgIT09IG51bGxcbiAgICAgICYmIChydG4gfHwgcnRuID09PSAwKVxuICAgICAgJiYgcnRuLnRvRml4ZWQpIHtcbiAgICAgIHJ0biA9IHBhcnNlRmxvYXQocnRuLnRvRml4ZWQoZGVjUGxhY2VzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ0bjtcbiAgfVxuXG4gIGFwcGx5VmFsdWUoaXRlbTogYW55LCBzdGF0ZTogYW55KSB7XG4gICAgaXRlbVt0aGlzLmNvbHVtbkRlZi5maWVsZF0gPSBzdGF0ZTtcbiAgfVxuXG4gIGlzVmFsdWVDaGFuZ2VkKCkge1xuICAgIGNvbnN0IGVsbVZhbHVlID0gdGhpcy4kaW5wdXQudmFsKCk7XG4gICAgcmV0dXJuICghKGVsbVZhbHVlID09PSAnJyAmJiB0aGlzLmRlZmF1bHRWYWx1ZSA9PT0gbnVsbCkpICYmIChlbG1WYWx1ZSAhPT0gdGhpcy5kZWZhdWx0VmFsdWUpO1xuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBjb25zdCB2YWxpZGF0aW9uID0gdGhpcy52YWxpZGF0ZSgpO1xuICAgIGlmICh2YWxpZGF0aW9uICYmIHZhbGlkYXRpb24udmFsaWQpIHtcbiAgICAgIGlmICh0aGlzLmhhc0F1dG9Db21taXRFZGl0KSB7XG4gICAgICAgIHRoaXMuYXJncy5ncmlkLmdldEVkaXRvckxvY2soKS5jb21taXRDdXJyZW50RWRpdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcmdzLmNvbW1pdENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZSgpOiBFZGl0b3JWYWxpZGF0b3JPdXRwdXQge1xuICAgIGNvbnN0IGVsbVZhbHVlID0gdGhpcy4kaW5wdXQudmFsKCk7XG4gICAgY29uc3QgZmxvYXROdW1iZXIgPSAhaXNOYU4oZWxtVmFsdWUgYXMgbnVtYmVyKSA/IHBhcnNlRmxvYXQoZWxtVmFsdWUpIDogbnVsbDtcbiAgICBjb25zdCBkZWNQbGFjZXMgPSB0aGlzLmdldERlY2ltYWxQbGFjZXMoKTtcbiAgICBjb25zdCBtaW5WYWx1ZSA9IHRoaXMuY29sdW1uRWRpdG9yLm1pblZhbHVlO1xuICAgIGNvbnN0IG1heFZhbHVlID0gdGhpcy5jb2x1bW5FZGl0b3IubWF4VmFsdWU7XG4gICAgY29uc3QgZXJyb3JNc2cgPSB0aGlzLmNvbHVtbkVkaXRvci5lcnJvck1lc3NhZ2U7XG4gICAgY29uc3QgbWFwVmFsaWRhdGlvbiA9IHtcbiAgICAgICd7e21pblZhbHVlfX0nOiBtaW5WYWx1ZSxcbiAgICAgICd7e21heFZhbHVlfX0nOiBtYXhWYWx1ZSxcbiAgICAgICd7e21pbkRlY2ltYWx9fSc6IDAsXG4gICAgICAne3ttYXhEZWNpbWFsfX0nOiBkZWNQbGFjZXNcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMudmFsaWRhdG9yKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0cyA9IHRoaXMudmFsaWRhdG9yKGVsbVZhbHVlLCB0aGlzLmFyZ3MpO1xuICAgICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0cy52YWxpZCkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGlvblJlc3VsdHM7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc05hTihlbG1WYWx1ZSBhcyBudW1iZXIpIHx8IChkZWNQbGFjZXMgPT09IDAgJiYgIS9eWy0rXT8oXFxkKyhcXC4pPyhcXGQpKikkLy50ZXN0KGVsbVZhbHVlKSkpIHtcbiAgICAgIC8vIHdoZW4gZGVjaW1hbCB2YWx1ZSBpcyAwICh3aGljaCBpcyB0aGUgZGVmYXVsdCksIHdlIGFjY2VwdCAwIG9yIG1vcmUgZGVjaW1hbCB2YWx1ZXNcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgbXNnOiBlcnJvck1zZyB8fCBDb25zdGFudHMuVkFMSURBVElPTl9FRElUT1JfVkFMSURfTlVNQkVSXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobWluVmFsdWUgIT09IHVuZGVmaW5lZCAmJiBtYXhWYWx1ZSAhPT0gdW5kZWZpbmVkICYmIGZsb2F0TnVtYmVyICE9PSBudWxsICYmIChmbG9hdE51bWJlciA8IG1pblZhbHVlIHx8IGZsb2F0TnVtYmVyID4gbWF4VmFsdWUpKSB7XG4gICAgICAvLyBNSU4gJiBNQVggVmFsdWVzIHByb3ZpZGVkXG4gICAgICAvLyB3aGVuIGRlY2ltYWwgdmFsdWUgaXMgYmlnZ2VyIHRoYW4gMCwgd2Ugb25seSBhY2NlcHQgdGhlIGRlY2ltYWwgdmFsdWVzIGFzIHRoYXQgdmFsdWUgc2V0XG4gICAgICAvLyBmb3IgZXhhbXBsZSBpZiB3ZSBzZXQgZGVjaW1hbFBsYWNlcyB0byAyLCB3ZSB3aWxsIG9ubHkgYWNjZXB0IG51bWJlcnMgYmV0d2VlbiAwIGFuZCAyIGRlY2ltYWxzXG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIG1zZzogZXJyb3JNc2cgfHwgQ29uc3RhbnRzLlZBTElEQVRJT05fRURJVE9SX05VTUJFUl9CRVRXRUVOLnJlcGxhY2UoL3t7bWluVmFsdWV9fXx7e21heFZhbHVlfX0vZ2ksIChtYXRjaGVkKSA9PiBtYXBWYWxpZGF0aW9uW21hdGNoZWRdKVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG1pblZhbHVlICE9PSB1bmRlZmluZWQgJiYgZmxvYXROdW1iZXIgIT09IG51bGwgJiYgZmxvYXROdW1iZXIgPD0gbWluVmFsdWUpIHtcbiAgICAgIC8vIE1JTiBWQUxVRSBPTkxZXG4gICAgICAvLyB3aGVuIGRlY2ltYWwgdmFsdWUgaXMgYmlnZ2VyIHRoYW4gMCwgd2Ugb25seSBhY2NlcHQgdGhlIGRlY2ltYWwgdmFsdWVzIGFzIHRoYXQgdmFsdWUgc2V0XG4gICAgICAvLyBmb3IgZXhhbXBsZSBpZiB3ZSBzZXQgZGVjaW1hbFBsYWNlcyB0byAyLCB3ZSB3aWxsIG9ubHkgYWNjZXB0IG51bWJlcnMgYmV0d2VlbiAwIGFuZCAyIGRlY2ltYWxzXG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIG1zZzogZXJyb3JNc2cgfHwgQ29uc3RhbnRzLlZBTElEQVRJT05fRURJVE9SX05VTUJFUl9NSU4ucmVwbGFjZSgve3ttaW5WYWx1ZX19L2dpLCAobWF0Y2hlZCkgPT4gbWFwVmFsaWRhdGlvblttYXRjaGVkXSlcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChtYXhWYWx1ZSAhPT0gdW5kZWZpbmVkICYmIGZsb2F0TnVtYmVyICE9PSBudWxsICYmIGZsb2F0TnVtYmVyID49IG1heFZhbHVlKSB7XG4gICAgICAvLyBNQVggVkFMVUUgT05MWVxuICAgICAgLy8gd2hlbiBkZWNpbWFsIHZhbHVlIGlzIGJpZ2dlciB0aGFuIDAsIHdlIG9ubHkgYWNjZXB0IHRoZSBkZWNpbWFsIHZhbHVlcyBhcyB0aGF0IHZhbHVlIHNldFxuICAgICAgLy8gZm9yIGV4YW1wbGUgaWYgd2Ugc2V0IGRlY2ltYWxQbGFjZXMgdG8gMiwgd2Ugd2lsbCBvbmx5IGFjY2VwdCBudW1iZXJzIGJldHdlZW4gMCBhbmQgMiBkZWNpbWFsc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICBtc2c6IGVycm9yTXNnIHx8IENvbnN0YW50cy5WQUxJREFUSU9OX0VESVRPUl9OVU1CRVJfTUFYLnJlcGxhY2UoL3t7bWF4VmFsdWV9fS9naSwgKG1hdGNoZWQpID0+IG1hcFZhbGlkYXRpb25bbWF0Y2hlZF0pXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoKGRlY1BsYWNlcyA+IDAgJiYgIW5ldyBSZWdFeHAoYF4oXFxcXGQqKFxcXFwuKT8oXFxcXGQpezAsJHtkZWNQbGFjZXN9fSkkYCkudGVzdChlbG1WYWx1ZSkpKSB7XG4gICAgICAvLyB3aGVuIGRlY2ltYWwgdmFsdWUgaXMgYmlnZ2VyIHRoYW4gMCwgd2Ugb25seSBhY2NlcHQgdGhlIGRlY2ltYWwgdmFsdWVzIGFzIHRoYXQgdmFsdWUgc2V0XG4gICAgICAvLyBmb3IgZXhhbXBsZSBpZiB3ZSBzZXQgZGVjaW1hbFBsYWNlcyB0byAyLCB3ZSB3aWxsIG9ubHkgYWNjZXB0IG51bWJlcnMgYmV0d2VlbiAwIGFuZCAyIGRlY2ltYWxzXG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIG1zZzogZXJyb3JNc2cgfHwgQ29uc3RhbnRzLlZBTElEQVRJT05fRURJVE9SX0RFQ0lNQUxfQkVUV0VFTi5yZXBsYWNlKC97e21pbkRlY2ltYWx9fXx7e21heERlY2ltYWx9fS9naSwgKG1hdGNoZWQpID0+IG1hcFZhbGlkYXRpb25bbWF0Y2hlZF0pXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgIG1zZzogbnVsbFxuICAgIH07XG4gIH1cbn1cbiJdfQ==