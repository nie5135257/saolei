window.onload = function () {
	let btn = document.getElementById("btn")
	let begin = document.getElementById("begin")
	let table = document.getElementById("table")
	let level = document.getElementById("level").value
	let p = document.getElementById("p")
	let span = document.getElementById("num")
	let arrBg = []
	let res = 0
	let sum = 0
	let levelMath = 0



	btn.onclick = function(){
		begin.style.display = "none"
		level = document.getElementById("level").value
		Tab(level)

		arrBg = MyRandom(level,0)
		sum = arrBg.length
		Add(arrBg,"")
		span.innerHTML = sum
		p.style.display = "block"
	}
	
	table.onclick = function (e) {
		if(e.target.getAttribute("sign") == "no" || e.target.getAttribute("sign") == "ok"){
			alert("请先取消标记")
			return false
		}
		if(e.target.tagName=="TD"){
			
			e.target.style.backgroundColor = "#fff"
			let tr = e.target.parentNode.rowIndex
			let td = e.target.cellIndex
			res = MyMath(tr,td,level,arrBg,res)
			if(res == level*level-sum){
				Add(arrBg,"url('img/1.jpg')")
				alert("你赢了")
				table.innerHTML = ""
				p.style.display = "none"
				begin.style.display = "block"
				return 0
			}
		}
	}
	table.oncontextmenu=function(e){
		
		if(e.target.className == "ok") 
			return false
    	if(e.target.tagName == "TD"){
    		if(e.target.getAttribute("sign") == undefined){
    			e.target.setAttribute("sign","ok")
    			e.target.style.background = "url('img/2.jpg')"
    			e.target.style.backgroundSize = "30px 30px"
    			levelMath++

    		}else if(e.target.getAttribute("sign") == "ok"){
    			e.target.setAttribute("sign","no")
    			e.target.style.background = "url('img/3.jpg')"
    			e.target.style.backgroundSize = "30px 30px"
    			levelMath--

    		}else if(e.target.getAttribute("sign") == "no"){
    			e.target.setAttribute("sign","")
    			e.target.style.background = ""
    			e.target.style.backgroundSize = "30px 30px"

    		}else if(e.target.getAttribute("sign") == ""){
    			e.target.setAttribute("sign","ok")
    			e.target.style.background = "url('img/2.jpg')"
    			e.target.style.backgroundSize = "30px 30px"
    			levelMath
    		}
    		span.innerHTML =  sum - levelMath
    	}

    	return false
    }
}

//设置网格
function Tab(sum){
	let str = ""
	for (var i = 0; i < sum; i++) {
		str+="<tr>"
		for (var j = 0; j < sum; j++) {
			str+="<td></td>"
		}
		str+="</tr>"
	}
	table.innerHTML = str
}

//生成地雷位置
function MyRandom(max,min){
	let arr = []
	for(let i = 0; i < max*2; i++){
		var tr = Math.round(Math.random()*(max-min-1)+min)
		var td = Math.round(Math.random()*(max-min-1)+min)
		arr.push([tr,td])
	}
	return Arr(arr)
}

//设置地雷
function Add(arr,bg){
	for (let i = 0; i < arr.length; i++) {
		table.children[arr[i][0]].children[arr[i][1]].style.background = bg
		table.children[arr[i][0]].children[arr[i][1]].style.backgroundSize = "30px 30px"
		table.children[arr[i][0]].children[arr[i][1]].className = "mine"
	}
}

//设置数字
function MyMath(tr,td,level,arrBg,res){
	let mine = table.children[tr].children[td].className
	if(mine == "mine"){
		Add(arrBg,"url('img/1.jpg')")
		alert("额，你完了，地雷你都敢踩啊!!!")
		table.innerHTML = ""
		p.style.display = "none"
		begin.style.display = "block"
		return 0
	}

	if(table.children[tr].children[td].className != "ok")
		res++
	table.children[tr].children[td].className = "ok"
	
	let count = Count(tr,td,level)
	if(count==0){
		let arr1 = Zero(tr,td,level)
		while(arr1.length > 0){
			let x = []
			let y = []
			for (var i = 0; i < arr1.length; i++) {
				x = Zero(arr1[i][0],arr1[i][1],level)
				y = y.concat(x)
			}
			arr1 = y
		}
	}else{
		table.children[tr].children[td].innerHTML = count
	}
	
	function Zero(tr,td,level){
		let arr = []
		let arr1 = []
		Fn1((i,j)=>{
			arr.push([tr+i,td+j]) 
		},tr,td,level)

		let count1 = 0
		for (var i = 0; i < arr.length; i++) {
			count1 = Count(arr[i][0],arr[i][1],level)
			if(count1 != 0){
				table.children[arr[i][0]].children[arr[i][1]].innerHTML = count1
			}else{
				arr1.push([arr[i][0],arr[i][1]])
			}

			if(table.children[arr[i][0]].children[arr[i][1]].className != "ok")
				res++
			table.children[arr[i][0]].children[arr[i][1]].className = "ok"
			
			table.children[arr[i][0]].children[arr[i][1]].style.backgroundColor = "#fff"
		}
		return arr1
	}

	return res

}

//计算当前位置数字
function Count(tr,td,level){
	let count = 0
	Fn1(function(i,j){
		mine = table.children[tr+i].children[td+j].className
		if(mine == "mine")
			count++
	},tr,td,level)
	return count
}

//数字为0时周围计算
function All(tr,td,level){
	
}

function Fn1(fun,tr,td,level){
	let i,_j,x,y;
	if(tr==0){
		x = 2
		i = 0
	}else if(tr==(level-1)){
		x = 1
		i = -1
	}else{
		x = 2
		i = -1
	}

	if(td==0){
		y = 2
		_j = 0
	}else if(td==(level-1)){
		y = 1
		_j = -1
	}else{
		y = 2
		_j = -1
	}

	for (i; i < x; i++) {
		for (var j = _j; j < y; j++) {
			var ok = table.children[tr+i].children[td+j].className
			if(ok == "ok"){
				continue
			}
			fun(i,j)
		}
	}
}


//二维数组去重
function Arr(arr){
	let arr1 = []
	arr.forEach((a,i,t)=>{
		var x = a[0] + "*" + a[1]
		arr1.push(x)
	})
	arr1 = new Set(arr1)
	let arr2 = []
	arr1.forEach(i=>{
		var x = arr.filter(a=>a[0] + "*" + a[1] == i)
		arr2.push(x[0]) 
	})
	return arr2
}