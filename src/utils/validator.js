 /****
 * @return {Boolean}
 * 成立:true | 失败：false
 */
const validate = {
	required(value) {
      return typeof value === 'string' ? !!value.trim() : false
	},
	min(value, range) {
		return value.length >= Number(range)
	},
	max(value, range) {
		return value.length <= Number(range)
	},
	tel(value) {
		return /^1[3456789]\d{9}$/.test(value)
	},
	qq(value) {
		return /^\d{5,12}$/.test(value)
	},
	email(value) {
		return /^(\w|\-)+@(\w|\-)+(.\w|\-)+/.test(value)
	},
	reg(value, reg) {
		return new RegExp(reg).test(value)
	},
	// [111，222]
	same(values) {
		return [...new Set(values)].length === 1
	},
	between(value, range) {
		return value.length >= Number(range[0]) && value.length <= Number(range[1])
   },
   value(value, targetVal, dataType) {
      if (['string', 'boolean', 'number'].indexOf(dataType) >= 0) {
         if (dataType === 'string') {
            return value === targetVal
         } else {
            return value === JSON.parse(targetVal)
         }
      } else {
         return false
      }
   }
}

class Validator {

	constructor(fields = {}, rules = {}, messages = {}) {
		if (this.makeValidate(fields, rules, messages)) {
         this._message('success', true)
      }
	}
   
	/**
	 * @param {Object} fields { k: value }
	 * @param {Object} rules { k:  [rule] }
	 * @param {Object} messages { rule: msg }
	 * @return {Boolean}
	 */
	makeValidate(fields, rules, messages) {
		for (let k in fields) {
			if (typeof rules[k] === 'object') {
				for (let ruleItem of rules[k]) {
					const [ rule, range ] = ruleItem.split(':')
               var alias = k, value = fields[k]
               if (typeof fields[k] === 'object') {
                  alias = fields[k].alias || k
                  value = fields[k].value
               }
					let message = typeof messages[k] === 'object' ? messages[k][rule] : false
					switch (rule) {
						case 'required':
							if (!validate.required(value)) {
								this._message(message || alias + '不能为空')
								return false
							}
							break;
						case 'min':
							if (!validate.min(value, range)) {
								this._message(message || alias + '不能少于' + range + '位')
								return false
							}
							break;
						case 'max':
							if (!validate.max(value, range)) {
								this._message(message || alias + '不能大于' + range + '位')
								return false
							}
							break;
						case 'tel':
							if (!validate.tel(value)) {
								this._message(message || '手机格式有误')
								return false
							}
							break;
						case 'email':
							if (!validate.email(value)) {
								this._message(message || '邮箱格式有误')
								return false
							}
							break;
						case 'qq':
							if (!validate.qq(value)) {
								this._message(message || 'QQ格式有误')
								return false
							}
							break;
						case 'reg':
							if (!validate.reg(value, range)) {
								this._message(message || alias + '格式有误')
								return false
							}
							break;
						case 'same':
							console.log(range)
							let fieldKeys = range.split(','),
								values = [fields[k].value],
								aliases = [fields[k].alias || k]
							for (let key of fieldKeys) {
								console.log(fields, key)
								values.push(fields[key].value)
								aliases.push(fields[key].alias || key)
							}
							if (!validate.same(values)) {
								this._message(message || aliases.join('与') + '不匹配')
								return false
							}
                     break;
                  case 'value':
                     let targetVal = range.replace(/<[^>]*>/g, '')
                     let dataType = range.replace(targetVal, '').replace(/[<>]/g, '') || 'string'
                     console.log(targetVal, dataType)
                     if (!validate.value(value, targetVal, dataType)) {
                        this._message(message || alias + '与目标值不匹配')
                        return false
                     }
                     break;
                  case 'between':
                     const ranges = range.split(',')
                     if (!validate.between(value, ranges)) {
                        this._message(message || alias + '的值不在给定范围内')
                        return false
                     }
                     break;
					}
				}
			}
		}
		return true
	}

	_message(msg, success = false) {
      this.errMsg = msg
      this.status = success
   }
}

export default Validator