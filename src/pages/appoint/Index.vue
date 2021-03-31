<template>
	<main class="container">
		<img class="bg" src="./assets/bg.jpg">
		<form class="form" @submit="handleSubmit">
			<div class="form-header">
				<p class="form-header-en">KEEP MOVING KEEP LOVING</p>
				<h2 class="form-header-zh">立即免费预约体验课</h2>
			</div>
			<div class="form-body">	
				<div class="form-item">
					<label class="form-item_label">
						<img src="./assets/1.png" class="icon icon-user">
					</label>
					<input name="bName" v-model="formData.bName" placeholder="请输入宝宝姓名" />
				</div>	
				<div class="form-item">
					<label class="form-item_label">
						<img src="./assets/2.png" class="icon icon-parent">
					</label>
					<input name="pName" v-model="formData.pName" placeholder="请输入家长姓名" />
				</div>	
				<div class="form-item">
					<label class="form-item_label">
						<img src="./assets/3.png" class="icon icon-concat">
					</label>
					<input name="contact" v-model="formData.contact" placeholder="请输入联系方式" />
				</div>
				<div class="form-item submit">	
					<button class="form-item_submit" type="submit">立即预约</button>
				</div>
			</div>
		</form>

		<div class="copyright">
			<p>地址：拱墅区天阳D32时尚购物街区C座104</p>
			<p>公司电话（0571 81387057）13967187210</p>
		</div>
	</main>
</template>

<script>
const request = {
  create(method, url, params = {}, headers = {}) {
    const xhr = new XMLHttpRequest()
    const promise = new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (+xhr.readyState === 4) {
          +xhr.status === 200
            ? resolve(JSON.parse(xhr.responseText))
            : reject(+xhr.status)
        }
      }
    })
    method = method.toUpperCase()
    switch (method) {
      case 'GET':
        url += '?' + Object.keys(params).map(k => (`${k}=${params[k]}`)).join('&')
        xhr.open(method, url)
        xhr.send()
        break;
      case 'POST':
        xhr.open(method, url)
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
        params = encodeFormData(params)
        xhr.send(params)
        break;
    }
    return promise
  },
  get() {
    return this.create('GET', ...arguments)
  },
  post() {
    return this.create('post', ...arguments)
  }
}
function encodeFormData(data){
  if (!data) return '';
  var pairs = [];
  for(var name in data){
    if (!data.hasOwnProperty(name)) continue;
    if (typeof data[name] === 'function') continue;
    var value = data[name].toString();
    name = encodeURIComponent(name.replace('%20', '+'));
    value = encodeURIComponent(value.replace('%20', '+'));
    pairs.push(name + '=' + value);
  }
  return pairs.join('&');
}

export default {
	data() {
		return {
			formData: {
				bName: '',
				pName: '',
				contact: ''
			}
		}
	},
	methods: {
		handleSubmit: function(e) {
	    e = e || window.event;
	    e.preventDefault();
	  
	    // var formData = {
	    //   bName: e.target.bName.value.trim(),
	    //   pName: e.target.pName.value.trim(),
	    //   contact: e.target.contact.value.trim()
	    // }
	    const formData = this.formData
	    console.log(formData)

	    if (!formData.bName) {
	    	this.$toast('请输入宝宝姓名')
	    	return;
	    }

	    if (!formData.pName) {
	    	this.$toast('请输入家长姓名')
	    	return;
	    }

	    if (!formData.contact) {
	    	this.$toast('请输入联系方式')
	    	return;
	    }

	    this.$http.post('/api/appoint', formData)
	      .then(res => {
	      	this.$toast(res.data.msg)
	      	this.formData = {
	      		bName: '',
						pName: '',
						contact: ''
	      	}
	      })
	      .catch(err => {
	      	this.$toast('出错了，请稍后再试 :(')
	      })
	  }
	}
}
</script>