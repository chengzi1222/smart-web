export function calcTableHeight(height,deleteHeight){
	if (height===0){
		height =  document.getElementsByClassName("app-main")[0].clientHeight
	}
	return height - deleteHeight;
}

export function boxShadow(divWidth,tableWidth){
	if (divWidth>=tableWidth){
		return true
	}else{
		return false
	}
}