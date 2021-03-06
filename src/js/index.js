// step1. 요구사항 정리하기

// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력받고 엔터키 입력으로 추가한다.
// - [x] 메뉴의 이름을 입력받고 확인 버튼을 클릭하면 메뉴를 추가한다.
// - [x] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다.
// - [x] 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [x] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴 삭제시 브라우저에서 제공하는 `confirm` 인터페이스를 활용한다.

// $ : js에서 dom element를 가져올 때 관용적으로 사용

// step2 요구사항 - 상태 관리로 메뉴 관리하기

// - [x] TODO localStorage Read & Write
//       [x] localStorage에 있는 데이터를 저장한다.
//         [x] 메뉴를 추가할 때
//         [x] 메뉴를 수정할 때
//         [x] 메뉴를 삭제할 때
//       [x] localStorage에 있는 데이터를 읽어온다.
// - [] TODO 카테고리별 메뉴판 관리
//       [x] 에스프레소 메뉴 관리
//       [x] 프라푸치노 메뉴 관리
//       [x] 블렌디드 메뉴 관리
//       [x] 티바나 메뉴 관리
//       [x] 디저트 메뉴 관리
// - [] TODO 페이지 최초로 접근할 시 Read & Rendering
//       [x] 페이지에 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
//       [x] 에스프레소 메뉴를 페이지에 그려준다.
// - [] TODO 품절 상태 관리
//       [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 `sold-out` class를 추가하여 상태를 변경한다.
//       [x] 품절 버튼을 추가한다.
//       [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
//       [x] 클릭 이벤트에서 가장 가까운 li element의 class 속성 값에 sold-out을 추가한다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
	this.menu = {
		espresso: [],
		frappuccino: [],
		blended: [],
		teavana: [],
		desert: [],
	};
	this.currentCategory = "espresso"; // 처음 값을 espresso에서 불러온다.
	this.init = () => {
		if (store.getLocalStorage()) {
			this.menu = store.getLocalStorage();
		}
		render();
		initEventListeners();
	};

	const render = () => {
		const template = this.menu[this.currentCategory]
			.map((item, index) => {
				//map은 배열로 return값을 준다.
				return `
					<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
					<span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${
									item.name
								}</span>
					<button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
					> 품절 </button>
					<button
						type="button"
						class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
					>
						수정
					</button>
					<button
						type="button"
						class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
					>
						삭제
					</button>
				</li>`;
			})
			.join("");
		$("#menu-list").innerHTML = template;
		updateMenuCount();
	};

	// 상태(이 앱에서 변하는 것) - 메뉴명
	const updateMenuCount = () => {
		const menuCount = this.menu[this.currentCategory].length;
		$(".menu-count").innerText = `총 ${menuCount}개`;
	};

	const addMenuName = () => {
		if ($("#menu-name").value === "") {
			alert("값을 입력해주세요");
			return;
		}

		const menuName = $("#menu-name").value;
		this.menu[this.currentCategory].push({ name: menuName });
		store.setLocalStorage(this.menu);
		render();

		$("#menu-name").value = "";
	};

	// refactoring : 자주 쓰는 함수의 기능을 따로 분류
	const updateMenuName = (e) => {
		const menuId = e.target.closest("li").dataset.menuId; //'data-' -> dataset, 'menu-id' -> menuId
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
		this.menu[this.currentCategory][menuId].name = updatedMenuName; //menuId값의 name 업데이트된 네임으로 바꿈
		store.setLocalStorage(this.menu);
		render();
	};

	const removeMenuName = (e) => {
		if (confirm("정말 삭제하시겠습니까?")) {
			const menuId = e.target.closest("li").dataset.menuId;
			this.menu[this.currentCategory].splice(menuId, 1);
			store.setLocalStorage(this.menu);
			render();
		}
	};

	const soldOutMenu = (e) => {
		const menuId = e.target.closest("li").dataset.menuId;
		this.menu[this.currentCategory][menuId].soldOut =
			!this.menu[this.currentCategory][menuId].soldOut; // '!undefined' is true because 'undefined' implicitly converts to false.
		store.setLocalStorage(this.menu);
		render();
	};

	const initEventListeners = () => {
		// event delegation(위임)
		$("#menu-list").addEventListener("click", (e) => {
			if (e.target.classList.contains("menu-edit-button")) {
				updateMenuName(e);
				return;
			}
			if (e.target.classList.contains("menu-remove-button")) {
				removeMenuName(e);
				return;
			}

			if (e.target.classList.contains("menu-sold-out-button")) {
				soldOutMenu(e);
				return;
			}
		});

		// form 태그가 자동으로 전송되는걸 막아준다.
		$("#menu-form").addEventListener("submit", (e) => {
			e.preventDefault();
		});

		$("#menu-submit-button").addEventListener("click", addMenuName);

		// 메뉴의 이름을 입력받기
		$("#menu-name").addEventListener("keypress", (e) => {
			if (e.key !== "Enter") {
				return;
			}
			addMenuName();
		});

		$("nav").addEventListener("click", (e) => {
			const isCategoryButton =
				e.target.classList.contains("cafe-category-name");
			if (isCategoryButton) {
				const categoryName = e.target.dataset.categoryName;
				this.currentCategory = categoryName;
				$("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
				render();
			}
		});
	};
}

const app = new App(); // new 키워드를 사용하여 생성자 함수를 호출하게되면 이때의 this는 만들어질 객체를 참조한다.
app.init();
