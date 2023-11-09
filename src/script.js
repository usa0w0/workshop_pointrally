let labels = ['Pr', 'Ae', 'Ph', 'Il']

function getUrlParam(){
	const urlParams = {};
	new URLSearchParams(location.search || "").forEach((value, key) => {
		urlParams[key] = value;
	});
	return urlParams;
}

function loadByParam(){
	let urlParams = getUrlParam();
	console.log('urlParams:', urlParams)
	// パラメーターなしの場合
	if (urlParams.serial == undefined){
		console.log('Access to Top page')
		return
	} else {
		console.log('Serial=' + urlParams.serial, typeof('Q' + urlParams.serial))
		getPoint(urlParams.serial);
	}
}

function switchPageByCookie(){
	let handle_name = getCookie('handle');
	if (handle_name == undefined){
		document.getElementById('Guide').style.display = 'block';
		document.getElementById('Entry').style.display = 'block';
		document.getElementById('Point').style.display = 'none';
		document.getElementById('Serial').style.display = 'none';
		return
	} else {
		document.getElementById('praiseTitle').textContent = 'おめでとう！' + handle_name + 'さん';

		document.getElementById('Guide').style.display = 'block';
		document.getElementById('Entry').style.display = 'none';
		document.getElementById('Point').style.display = 'block';
		document.getElementById('Serial').style.display = 'none';

		loadPoints();
		loadByParam();

		return
	}
}
function loadPoints(){
	labels.forEach(function (target) {
		let point = getCookie(target);
		document.getElementById(target).getElementsByClassName('point-value')[0].textContent = point;
	})
}

function setCookie(name, value, expires=1){
	// 有効期限設定（原則1年）
	let date = new Date();
  date.setTime(date.getTime() + (expires * 365 * 24 * 60 * 60 * 1000));
	let cookie = name + '=' + escape(value) + "; expires=" + date.toUTCString();
	document.cookie = cookie
	return 0
}
function getCookie(name){
	let cookie = document.cookie;

	if (cookie && cookie.length > 0){
		let offset = cookie.indexOf(name + '=');
		let end;
		if (offset != -1){
			offset += name.length + 1;
			end = cookie.indexOf(';', offset);
			if (end == -1){
				end = cookie.length;
			}
			return unescape(cookie.substring(offset, end))
		}
	} else {
		return undefined
	}
}

function entryByEnter(key_code) {
	if (key_code == 13){entry()}
}
function entry(){
	document.getElementById('loading').style.display = 'block';

	const handle_name = document.getElementById('handle').value;
	_ = setCookie('handle', handle_name)

	labels.forEach(item => setCookie(item, '0'))
	console.log(document.cookie)

	document.getElementById('welcomeTitle').textContent = 'ようこそ！' + handle_name + 'さん'

	document.getElementById('loading').style.display = 'none';
	if (handle_name == '') {
		return
	} else {
		new bootstrap.Modal(document.getElementById('login-success')).show()
		switchPageByCookie()
	}
}

function entrySerial(){
	document.getElementById('loading').style.display = 'block';

	let serial = document.getElementById('serial_num').value;
	document.getElementById('serial_num').value = ''

	if (serial == '') {
		document.getElementById('loading').style.display = 'none';
		return
	} else {
		getPoint(serial)
	}
}
function getPoint(serial){
	document.getElementById('loading').style.display = 'block';

	// シリアルコードの認証
	let isIncorrect = false;
	let target
	let software
	switch (serial){
		case '000':
			target = 'Pr';
			software = 'Premiere Pro';
			break;
		case '001':
			target = 'Ae';
			software = 'After Effects';
			break;
		case '010':
			target = 'Ph';
			software = 'Photoshop';
			break;
		case '011':
			target = 'Il';
			software = 'Illustrator';
			break;
		case '100':
			target = 'Cam';
			software = '一眼レフカメラ';
			break;
		default:
			isIncorrect = true;
	}

	// 表示更新
	if (isIncorrect) {
		new bootstrap.Modal(document.getElementById('get-point-reject')).show()
	} else {
		let point_value_elem = document.getElementById(target).getElementsByClassName('point-value')[0]
		new_point_value = String(Number(point_value_elem.textContent) + 1)

		document.getElementById('challenge-software').textContent = software + 'に挑戦したんですね！';
		document.getElementById('change-point').textContent = point_value_elem.textContent + '→' + new_point_value + 'ptになりました。';

		point_value_elem.textContent = new_point_value
		_ = setCookie(target, new_point_value)

		new bootstrap.Modal(document.getElementById('get-point-success')).show()
	}

	// リロード防止
	let url = new URL(window.location.href);
	history.replaceState('', '', url.pathname);

	document.getElementById('loading').style.display = 'none';
}

switchPageByCookie()