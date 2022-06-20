const store = {
	setLocalStorage(menu) {
		localStorage.setItem("menu", JSON.stringify(menu)); // 문자열로 저장
	},
	getLocalStorage() {
		return JSON.parse(localStorage.getItem("menu")); // 문자열로 저장된 데이터 parsing
	},
};

export default store;