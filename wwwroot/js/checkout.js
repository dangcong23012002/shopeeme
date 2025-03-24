const modal = document.querySelector(".modal");

const mainForm = document.querySelector(".address-form__container");
const updateAddressForm = document.querySelector(".address-form__update");
const newAddressForm = document.querySelector(".address-form__new");

var data;
function getAPICheckout() {
    let userID = getCookies("userID");
    if (userID == undefined) {
        userID = 0;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('get', '/checkout/get-data?userID=' + userID + '', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {

            data = JSON.parse(xhr.responseText);

            console.log(data);

            showAddressForm(data);

            getCheckoutItemsDestop(data);

            setPaymentsType(data);

            setCheckoutMobile(data);

        }
    };
    xhr.send(null);
}
getAPICheckout();

function showAddressForm(data) {
    if (data.addresses.length == 0) {
        document.querySelector(".checkout__address-desc").classList.add("hide");
        openNewAddressForm(data);
        modal.classList.add('open');
    } else {
        setDataAddressDesc(data);
    }

}

function setDataAddressDesc(data) {
    let htmlAddressDesc = "";
    htmlAddressDesc +=
        `
                    <div class="checkout__address-desc">
                        <div class="checkout__address-desc-name">${data.addresses[0].sFullName}</div>
                        <div class="checkout__address-desc-phone">(+84) ${data.addresses[0].sPhone}</div>
                        <div class="checkout__address-desc-direction">
                            ${data.addresses[0].sAddress}
                        </div>
                        <div class="checkout__address-desc-sub">Mặc định</div>
                        <a href="javascript:openAddressModal()" class="checkout__address-desc-change">Thay đổi</a>
                    </div>
            `;
    document.querySelector(".checkout__address-detail").innerHTML = htmlAddressDesc;
}

function setDataAddressNewChoose() {
    let htmlCities = "";
    for (let i = 0 ; i < data.cities.length; i++) {
        htmlCities += " <li class='address-form__new-choose-detail-city-item' onclick='chooseCityNew(" + data.cities[i].pK_iCityID + ")'>";
        htmlCities += "" + data.cities[i].sCityName + "";
        htmlCities += " </li>";
    }
    document.querySelector(".address-form__new-choose-detail-city-list").innerHTML = htmlCities;
}

function chooseCityNew(FK_iCityID) {
    var city = data.cities.find((obj) => {
        return obj.pK_iCityID === FK_iCityID;
    });

    let htmlDistricts = "";
    for (let i = 0; i < data.districts.length; i++) {
        if (data.districts[i].fK_iCityID == FK_iCityID) {
            addAddressNewChooseDistrictList();
            htmlDistricts +=
                `
                    <li class="address-form__new-choose-detail-district-item" onclick="chooseDistrictNew(${data.districts[i].pK_iDistrictID})">
                        ${data.districts[i].sDistrictName}
                    </li>
                `;
        }
    }
    document.querySelector(".address-form__new-choose-detail-district-list").innerHTML = htmlDistricts;
    document.querySelector(".address-form__new-label-choose").style.display = 'none';
    document.querySelector(".address-form__new-input-choose").value = city.sCityName;
}

function chooseDistrictNew(FK_iDistrictID) {
    var district = data.addressChooses.find((obj) => {
        return obj.pK_iDistrictID === FK_iDistrictID;
    });

    let htmlStreets = "";
    for (let i = 0; i < data.addressChooses.length; i++) {
        if (data.addressChooses[i].pK_iDistrictID == FK_iDistrictID) {
            addAddressNewChooseStreetList();
            htmlStreets += 
            `
                <li class="address-form__new-choose-detail-street-item" onclick="chooseStreetNew(${data.addressChooses[i].pK_iStreetID})">
                    ${data.addressChooses[i].sStreetName}
                </li>
            `;
        }
    }
    document.querySelector(".address-form__new-choose-detail-street-list").innerHTML = htmlStreets;
    document.querySelector(".address-form__new-input-choose").value = district.sCityName + ", " + district.sDistrictName;
}

function chooseStreetNew(PK_iStreetID) {
    var addressChoose = data.addressChooses.find((obj) => {
        return obj.pK_iStreetID === PK_iStreetID;
    });
    console.log(addressChoose);
    document.querySelector(".address-form__new-choose").classList.remove("show");
    document.querySelector(".address-form__new-input-choose").value = addressChoose.sStreetName + ", " + addressChoose.sDistrictName + ", " + addressChoose.sCityName;
    changeTitleAddressNewChoose();
}

function showAddressNewChoose() {
    document.querySelector(".address-form__new-choose").classList.toggle("show");
}

function changeTitleAddressNewChoose() {
    const addressNewChooseTitle = document.querySelectorAll(".address-form__new-choose-detail-title");
    for (let i = 0; i < addressNewChooseTitle.length; i++) {
        addressNewChooseTitle[i].addEventListener('click', () => {
            if (i == 0) {
                addAddressNewChooseCityList();
            } else if (i == 1) {
                addAddressNewChooseDistrictList();
            } else if (i == 2) {
                addAddressNewChooseStreetList()
            } else {
                addAddressNewChooseCityList();
            }
        })
    }
}

function openAddressModal() {
    if (document.querySelector(".spinner") != null) {
        document.querySelector(".spinner").classList.add("hide");
    }
    modal.classList.add('open');
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/checkout/get-data', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);

            console.log(data);
            
            backMainForm(data);
            
        }
    };
    xhr.send(null);
}

function closeAddressModal() {
    modal.classList.remove('open')
}

function addAddressNewChooseCityList() {
    const addressNewChooseTitle = document.querySelectorAll(".address-form__new-choose-detail-title");
    const addressNewChooseCityList = document.querySelector(".address-form__new-choose-detail-city");
    const addressNewChooseDistrictList = document.querySelector(".address-form__new-choose-detail-district");
    const addressNewChooseStreetList = document.querySelector(".address-form__new-choose-detail-street");

    addressNewChooseTitle[0].classList.add("active");
    addressNewChooseTitle[1].classList.remove("active");
    addressNewChooseTitle[2].classList.remove("active");
    addressNewChooseCityList.classList.remove("hide");
    addressNewChooseDistrictList.classList.add("hide")
    addressNewChooseStreetList.classList.add("hide");
}

function addAddressNewChooseDistrictList() {
    const addressNewChooseTitle = document.querySelectorAll(".address-form__new-choose-detail-title");
    const addressNewChooseCityList = document.querySelector(".address-form__new-choose-detail-city");
    const addressNewChooseDistrictList = document.querySelector(".address-form__new-choose-detail-district");
    const addressNewChooseStreetList = document.querySelector(".address-form__new-choose-detail-street");

    addressNewChooseTitle[1].classList.add("active");
    addressNewChooseTitle[0].classList.remove("active");
    addressNewChooseTitle[2].classList.remove("active");
    addressNewChooseCityList.classList.add("hide")
    addressNewChooseStreetList.classList.add("hide");
    addressNewChooseDistrictList.classList.remove("hide");
}

function addAddressNewChooseStreetList() {
    const addressNewChooseTitle = document.querySelectorAll(".address-form__new-choose-detail-title");
    const addressNewChooseCityList = document.querySelector(".address-form__new-choose-detail-city");
    const addressNewChooseDistrictList = document.querySelector(".address-form__new-choose-detail-district");
    const addressNewChooseStreetList = document.querySelector(".address-form__new-choose-detail-street");

    addressNewChooseTitle[2].classList.add("active");
    addressNewChooseTitle[0].classList.remove("active");
    addressNewChooseTitle[1].classList.remove("active");
    addressNewChooseCityList.classList.add("hide");
    addressNewChooseDistrictList.classList.add("hide");
    addressNewChooseStreetList.classList.remove("hide");
}

function openUpdate(addressID, userID) {
    if (mainForm != null && newAddressForm != null) {
        mainForm.classList.add("hide");
        newAddressForm.classList.add("hide");
    }
    var formData = new FormData();
    formData.append("addressID", addressID);
    formData.append("userID", userID);
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/checkout/address-detail', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const detail = JSON.parse(xhr.responseText);
            document.querySelector(".modal__body").innerHTML = 
            `
                <div class="address-form">
                    <div class="address-form__update">
                        <div class="address-form__update-title">Câp nhật địa chỉ</div>
                        <div class="address-form__update-body">
                            <div class="address-form__update-div">
                                <div class="address-form__update-box">
                                    <div class="address-form__update-box-left">
                                        <input type="text" class="address-form__update-input address-form__update-input-fullname" value="${detail[0].sFullName}">
                                        <label for="" class="address-form__update-label">Họ và tên</label>
                                    </div>
                                    <div class="address-form__update-box-left">
                                        <input type="text" class="address-form__update-input address-form__update-input-phone" value="${detail[0].sPhone}">
                                        <div class="address-form__update-input-phone-suggest">
                                            (+84) ${detail[0].sPhone} <button>Sử dụng</button>
                                        </div>
                                        <label for="" class="address-form__update-label">Số điện thoại</label>
                                    </div>
                                </div>
                            </div>
                            <div class="address-form__update-div">
                                <input type="text" class="address-form__update-input address-form__update-input-choose"
                                    onclick="showAddressUpdateChoose()" value="${detail[0].sAddress}">
                                <div class="address-form__update-choose">
                                    <div class="address-form__update-choose-detail">
                                        <div class="address-form__update-choose-detail-header">
                                            <div class="address-form__update-choose-detail-title active">Tỉnh/Thành phố</div>
                                            <div class="address-form__update-choose-detail-title">Quận/Huyện</div>
                                            <div class="address-form__update-choose-detail-title">Phường/Xã</div>
                                        </div>
                                        <div class="address-form__update-choose-detail-body">
                                            <div class="address-form__update-choose-detail-city">
                                                <ul class="address-form__update-choose-detail-city-list">

                                                </ul>
                                            </div>
                                            <div class="address-form__update-choose-detail-district hide">
                                                <ul class="address-form__update-choose-detail-district-list">

                                                </ul>
                                            </div>
                                            <div class="address-form__update-choose-detail-street hide">
                                                <ul class="address-form__update-choose-detail-street-list">
                                                    <li class="address-form__update-choose-detail-street-item">
                                                        Định Công
                                                    </li>
                                                    <li class="address-form__update-choose-detail-street-item">
                                                        Trần Đại Nghĩa
                                                    </li>
                                                    <li class="address-form__update-choose-detail-street-item">
                                                        Định Công
                                                    </li>
                                                    <li class="address-form__update-choose-detail-street-item">
                                                        Trần Đại Nghĩa
                                                    </li>
                                                    <li class="address-form__update-choose-detail-street-item">
                                                        Định Công
                                                    </li>
                                                    <li class="address-form__update-choose-detail-street-item">
                                                        Trần Đại Nghĩa
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <i class="uil uil-angle-down address-form__update-div-icon"></i>
                                <label for="" class="address-form__update-label address-form__update-label-choose">Tỉnh/Thành
                                    phố, Quận/Huyện, Phường/Xã</label>
                            </div>
                            <div class="address-form__update-div">
                                <textarea name="" id="" class="address-form__update-textarea"></textarea>
                                <label for="" class="address-form__update-label">Địa chỉ cụ thể</label>
                            </div>
                            <div class="address-form__update-please">
                                <i class="uil uil-bell address-form__update-please-icon"></i>
                                <div class="address-form__update-please-desc">
                                    <div class="address-form__update-please-desc-title">Vui lòng ghim địa chỉ chính xác</div>
                                    <div class="address-form__update-please-desc-subtitle">Hãy chắc chắn vị trí trên bản đồ được
                                        ghim đúng để
                                        Shopee gửi hàng cho bạn nhé!</div>
                                </div>
                            </div>
                            <div class="address-form__update-map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.0349263999647!2d105.52882531470965!3d9.76310899301383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x746941d0e6aacf0!2zOcKwNDUnNDcuMiJOIDEwNcKwMzEnNTEuNyJF!5e0!3m2!1svi!2s!4v1659586535479!5m2!1svi!2s"
                                    width="100%" height="120px"></iframe>
                            </div>
                            <div class="address-form__update-type">
                                <div class="address-form__update-type-title">Loại địa chỉ:</div>
                                <div class="address-form__update-type-btns">
                                    <button class="address-form__update-type-btn">Nhà riêng</button>
                                    <button class="address-form__update-type-btn">Văn phòng</button>
                                </div>
                            </div>
                            <div class="address-form__update-set-default">
                                <input type="checkbox" class="address-form__update-set-default-input">
                                <label for="">Đặt làm mặc định</label>
                            </div>
                        </div>
                        <div class="address-form__update-footer">
                            <div class="address-form__update-footer-btns">
                                <button type="button" onclick="closeModal()" class="btn btn__address-back">Thoát</button>
                                <button class="btn btn--primary" onclick="updateAddressAccount(${detail[0].pK_iAddressID}, ${detail[0].fK_iUserID})">Cập nhật</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector(".btn__address-back").addEventListener('click', () => {
                openAddressModal(data);
            });
        }
    };
    xhr.send(formData);
}

function updateAddressAccount(addressID, userID) {
    const fullnameUpdate = document.querySelector(".address-form__update-input-fullname").value;
    const phoneUpdate = document.querySelector(".address-form__update-input-phone").value;
    const addressUpdate = document.querySelector(".address-form__update-input-choose").value;
    
    var formData = new FormData();
    formData.append("addressID", addressID);
    formData.append("userID", userID);
    formData.append("fullname", fullnameUpdate);
    formData.append("phone", phoneUpdate);
    formData.append("address", addressUpdate);

    var xhr = new XMLHttpRequest();
    xhr.open('post', '/checkout/address-update', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const result = JSON.parse(xhr.responseText);
            console.log(result);

            addSpinner();

            if (result.status.statusCode == 1) {
                setTimeout(() => {
                    document.querySelector(".modal").classList.remove('open');
                    setTimeout(() => {
                        toast({ title: "Thông báo", msg: `${result.status.message}`, type: "success", duration: 5000 });
                        document.querySelector(".modal").classList.add('open');
                        let htmlAddress = "";
                        htmlAddress +=
                            `
                            <div class="address-form">
                                <div class="address-form__container">
                                    <div class="address-form__title">Địa chỉ của tôi</div>
                                    <div class="address-form__body">
                                        <ul class="address-form__list">`;
                                        for (let i = 0; i < result.addresses.length; i++) {
                                            if (result.addresses[i].iDefault == 1) {
                                                htmlAddress +=
                                                    `
                                                                    <li class="address-form__item default">
                                                                        <div class="address-form__item-box">
                                                                            <input type="radio" name="address" class="address-form__item-input" checked>
                                                                        </div>
                                                                        <div class="address-form__item-content">
                                                                            <div class="address-form__item-header">
                                                                                <div class="address-form__item-header-info">
                                                                                    <div class="address-form__item-name">${result.addresses[i].sFullName}</div>
                                                                                    <div class="address-form__item-phone">(+84) ${result.addresses[i].sPhone}</div>
                                                                                </div>
                                                                                <a href="javascript:openUpdate(${result.addresses[i].pK_iAddressID}, ${result.addresses[i].fK_iUserID})" class="address-form__item-update">Cập nhật</a>
                                                                            </div>
                                                                            <div class="address-form__item-body">
                                                                                <div class="address-form__item-body-row">
                                                                                    ${result.addresses[i].sAddress}
                                                                                </div>
                                                                            </div>
                                                                            <button class="address-form__item-sub">Mặc định</button>
                                                                        </div>
                                                                    </li>
                                                `;
                                            } else {
                                                htmlAddress +=
                                                    `
                                                                    <li class="address-form__item">
                                                                        <div class="address-form__item-box">
                                                                            <input type="radio" name="address" class="address-form__item-input">
                                                                        </div>
                                                                        <div class="address-form__item-content">
                                                                            <div class="address-form__item-header">
                                                                                <div class="address-form__item-header-info">
                                                                                    <div class="address-form__item-name">${result.addresses[i].sFullName}</div>
                                                                                    <div class="address-form__item-phone">(+84) ${result.addresses[i].sPhone}</div>
                                                                                </div>
                                                                                <a href="javascript:openUpdate(${result.addresses[i].pK_iAddressID}, ${result.addresses[i].fK_iUserID})" class="address-form__item-update">Cập nhật</a>
                                                                            </div>
                                                                            <div class="address-form__item-body">
                                                                                <div class="address-form__item-body-row">
                                                                                    ${result.addresses[i].sAddress}
                                                                                </div>
                                                                            </div>
                                                                            <button class="address-form__item-sub">Mặc định</button>
                                                                        </div>
                                                                    </li>
                                                `;
                                            }
                                        }
    
                                        htmlAddress += `</ul>
                                        <button class="address-form__add-btn" onclick="openNewAddressForm()">
                                            <i class="uil uil-plus address-form__add-btn-icon"></i>
                                            <span>Thêm địa chỉ mới</span>
                                        </button>
                                    </div>
                                    <div class="address-form__footer">
                                        <button class="btn address-form__btn-destroy" onclick="closeAddressModal()">Huỷ</button>
                                        <button class="btn btn--primary">Xác nhận</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        document.querySelector(".modal__body").innerHTML = htmlAddress;
                        setDataAddressDesc(data);
                    }, 1000)
                }, 2000);
            }
        }
    };
    xhr.send(formData);
}

function backMainForm(data) {
    if (updateAddressForm != null && newAddressForm != null) {
        updateAddressForm.classList.add("hide");
        newAddressForm.classList.add("hide");
    }
    let htmlAddress = "";
    htmlAddress += 
    `
        <div class="address-form">
            <div class="address-form__container">
                <div class="address-form__title">Địa chỉ của tôi</div>
                <div class="address-form__body">
                    <ul class="address-form__list">`;
                    for (let i = 0; i < data.addresses.length; i++) {
                        if (data.addresses[i].iDefault == 1) {
                            htmlAddress += 
                            `
                                                <li class="address-form__item default">
                                                    <div class="address-form__item-box">
                                                        <input type="radio" name="address" class="address-form__item-input" checked>
                                                    </div>
                                                    <div class="address-form__item-content">
                                                        <div class="address-form__item-header">
                                                            <div class="address-form__item-header-info">
                                                                <div class="address-form__item-name">${data.addresses[i].sFullName}</div>
                                                                <div class="address-form__item-phone">(+84) ${data.addresses[i].sPhone}</div>
                                                            </div>
                                                            <a href="javascript:openUpdate(${data.addresses[i].pK_iAddressID}, ${data.addresses[i].fK_iUserID})" class="address-form__item-update">Cập nhật</a>
                                                        </div>
                                                        <div class="address-form__item-body">
                                                            <div class="address-form__item-body-row">
                                                                ${data.addresses[i].sAddress}
                                                            </div>
                                                        </div>
                                                        <button class="address-form__item-sub">Mặc định</button>
                                                    </div>
                                                </li>
                            `;
                        } else {
                            htmlAddress += 
                            `
                                                <li class="address-form__item">
                                                    <div class="address-form__item-box">
                                                        <input type="radio" name="address" class="address-form__item-input">
                                                    </div>
                                                    <div class="address-form__item-content">
                                                        <div class="address-form__item-header">
                                                            <div class="address-form__item-header-info">
                                                                <div class="address-form__item-name">${data.addresses[i].sFullName}</div>
                                                                <div class="address-form__item-phone">(+84) ${data.addresses[i].sPhone}</div>
                                                            </div>
                                                            <a href="javascript:openUpdate(${data.addresses[i].pK_iAddressID}, ${data.addresses[i].fK_iUserID})" class="address-form__item-update">Cập nhật</a>
                                                        </div>
                                                        <div class="address-form__item-body">
                                                            <div class="address-form__item-body-row">
                                                                ${data.addresses[i].sAddress}
                                                            </div>
                                                        </div>
                                                        <button class="address-form__item-sub">Mặc định</button>
                                                    </div>
                                                </li>
                            `;
                        }
                    }
                        
    htmlAddress += `</ul>
                    <button class="address-form__add-btn" onclick="openNewAddressForm()">
                        <i class="uil uil-plus address-form__add-btn-icon"></i>
                        <span>Thêm địa chỉ mới</span>
                    </button>
                </div>
                <div class="address-form__footer">
                    <button class="btn address-form__btn-destroy" onclick="closeAddressModal()">Huỷ</button>
                    <button class="btn btn--primary">Xác nhận</button>
                </div>
            </div>
        </div>
    `;
    document.querySelector(".modal__body").innerHTML = htmlAddress;
}

function openNewAddressForm(data) {
    if (mainForm != null && updateAddressForm != null) {
        mainForm.classList.add("hide")
        updateAddressForm.classList.add("hide")
    }
    document.querySelector(".modal__body").innerHTML = 
    `
        <div class="address-form">
            <div class="address-form__new">
                <div class="address-form__new-title">
                        Địa chỉ mới
                        <div class="address-form__new-title-sub">Để đặt hàng, vui lòng thêm địa chỉ nhận hàng</div>
                    </div>
                    <div class="address-form__new-body">
                        <div class="address-form__new-div">
                            <div class="address-form__new-box">
                                <div class="address-form__new-box-left">
                                    <input type="text" class="address-form__new-input address-form__new-input-fullname">
                                    <label for="" class="address-form__new-label address-form__new-label-fullname">Họ và tên</label>
                                </div>
                                <div class="address-form__new-box-right">
                                    <input type="text" class="address-form__new-input address-form__new-input-phone">
                                    <label for="" class="address-form__new-label address-form__new-label-phone">Số điện thoại</label>
                                </div>
                            </div>
                        </div>
                        <div class="address-form__new-div">
                            <input type="text" class="address-form__new-input address-form__new-input-choose" onclick="showAddressNewChoose()">
                            <div class="address-form__new-choose">
                                <div class="address-form__new-choose-detail">
                                    <div class="address-form__new-choose-detail-header">
                                        <div class="address-form__new-choose-detail-title active">Tỉnh/Thành phố</div>
                                        <div class="address-form__new-choose-detail-title">Quận/Huyện</div>
                                        <div class="address-form__new-choose-detail-title">Phường/Xã</div>
                                    </div>
                                    <div class="address-form__new-choose-detail-body">
                                        <div class="address-form__new-choose-detail-city">
                                            <ul class="address-form__new-choose-detail-city-list">
                                                
                                            </ul>
                                        </div>
                                        <div class="address-form__new-choose-detail-district hide">
                                            <ul class="address-form__new-choose-detail-district-list">
                                                
                                            </ul>
                                        </div>
                                        <div class="address-form__new-choose-detail-street hide">
                                            <ul class="address-form__new-choose-detail-street-list">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <i class="uil uil-angle-down address-form__new-div-icon"></i>
                            <label for="" class="address-form__new-label address-form__new-label-choose">Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</label>
                        </div>
                        <div class="address-form__new-div">
                            <textarea name="" id="" class="address-form__new-textarea address-form__new-textarea-desc"></textarea>
                            <label for=""class="address-form__new-label address-form__new-label-desc">Địa chỉ cụ thể</label>
                        </div>
                        <div class="address-form__new-please">
                            <i class="uil uil-bell address-form__new-please-icon"></i>
                            <div class="address-form__new-please-desc">
                                <div class="address-form__new-please-desc-title">Vui lòng ghim địa chỉ chính xác</div>
                                <div class="address-form__new-please-desc-subtitle">Hãy chắc chắn vị trí trên bản đồ được ghim đúng để Shopee gửi hàng cho bạn nhé!</div>
                            </div>
                        </div>
                        <div class="address-form__new-map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.0349263999647!2d105.52882531470965!3d9.76310899301383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x746941d0e6aacf0!2zOcKwNDUnNDcuMiJOIDEwNcKwMzEnNTEuNyJF!5e0!3m2!1svi!2s!4v1659586535479!5m2!1svi!2s" width="100%" height="120px" ></iframe>
                        </div>
                        <div class="address-form__new-type">
                            <div class="address-form__new-type-title">Loại địa chỉ:</div>
                            <div class="address-form__new-type-btns">
                                <button class="address-form__new-type-btn">Nhà riêng</button>
                                <button class="address-form__new-type-btn">Văn phòng</button>
                            </div>
                        </div>
                        <div class="address-form__new-set-default">
                            <input type="checkbox" class="address-form__new-set-default-input">
                            <label for="">Đặt làm mặc định</label>
                        </div>
                    </div>
                    <div class="address-form__new-footer">
                        <div class="address-form__new-footer-btns">
                            <button class="btn" onclick="backMainForm()">Trở lại</button>
                            <button class="btn btn--primary address-form__new-btn">Hoàn thành</button>
                        </div>
                    </div>
            </div>
        </div>
    `;
    if (data.userInfos.length != 0) {
        document.querySelector(".address-form__new-label-fullname").style.display = 'none';
        document.querySelector(".address-form__new-input-fullname").value = data.userInfos[0].sFullName;
    }
    setDataAddressNewChoose();
    addEvent();
}

function addressNewAddress() {
    const phone = document.querySelector(".address-form__new-input-phone").value;
    const addressChoose = document.querySelector(".address-form__new-input-choose").value;
    const addressDesc = document.querySelector(".address-form__new-textarea-desc").value;
    const address = addressDesc + ", " + addressChoose;

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("address", address);

    var xhr = new XMLHttpRequest();
    xhr.open('post', '/checkout/crud-address', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            let htmlAddressDesc = "";
            htmlAddressDesc += 
            `
                    <div class="checkout__address-desc">
                        <div class="checkout__address-desc-name">${data.addresses[0].sFullName}</div>
                        <div class="checkout__address-desc-phone">(+84) ${data.addresses[0].sPhone}</div>
                        <div class="checkout__address-desc-direction">
                            ${data.addresses[0].sAddress}
                        </div>
                        <div class="checkout__address-desc-sub">Mặc định</div>
                        <a href="javascript:openAddressModal()" class="checkout__address-desc-change">Thay đổi</a>
                    </div>
            `;
            document.querySelector(".checkout__address-detail").innerHTML = htmlAddressDesc;
            
            closeAddressModal();

            addSpinner();

            addConfirmSuccess();
        }
    };
    xhr.send(formData);
}

function addSpinner() {
    document.querySelector(".modal").classList.add('open');
    document.querySelector(".modal__body").innerHTML = 
    `
        <div class="spinner"></div>
    `;
}

function addConfirmSuccess() {
    setTimeout(() => {
        document.querySelector(".modal").classList.remove('open');
        setTimeout(() => {
            toast({ title: "Thông báo", msg: `Thêm địa chỉ thành công`, type: "success", duration: 5000 });
            document.querySelector(".checkout__address-desc").classList.remove("hide");
        }, 1000)
    }, 2000);
}

// Checkout Items
function getCheckoutItemsDestop(data) {
    var checkout = JSON.parse(sessionStorage.getItem("checkout"));
    console.log(checkout);
    let htmlCheckoutItem = "";
    for (let i = 0; i < checkout.length; i++) {
        htmlCheckoutItem += 
        `
                    <div class="checkout__product">
                        <div class="checkout__product-header">
                            <div class="checkout__product-header-name">Sản phẩm</div>
                            <div class="checkout__product-header-type"></div>
                            <div class="checkout__product-header-cost">Đơn giá</div>
                            <div class="checkout__product-header-quantity">Số lượng</div>
                            <div class="checkout__product-header-money">Thành tiền</div>
                        </div>
                        <div class="checkout__product-body">
                            <div class="checkout__product-body-felling">
                                <button type="button" class="checkout__product-body-felling-btn">Yêu thích</button>
                                <a href="#" class="checkout__product-body-felling-chat">
                                    <i class="uil uil-chat checkout__product-body-felling-chat-icon"></i>
                                    <span>Chat ngay</span>
                                </a>
                            </div>
                            <div class="checkout__product-body-item">
                                <div class="checkout__product-body-item-name">
                                    <div class="checkout__product-body-item-img"
                                        style="background-image: url(/img/${checkout[i][2]});"></div>
                                    <div class="checkout__product-body-item-desc">
                                        <div class="checkout__product-body-item-text">
                                            ${checkout[i][1]}
                                        </div>
                                        <span>Đổi ý miễn phí 15 ngày</span>
                                    </div>
                                </div>
                                <div class="checkout__product-body-item-type">Loại: Bạc</div>
                                <div class="checkout__product-body-item-cost">${money(checkout[i][3])} đ</div>
                                <div class="checkout__product-body-item-quantity">${checkout[i][4]}</div>
                                <div class="checkout__product-body-item-money">${money(checkout[i][5])} đ</div>
                            </div>
                            <div class="checkout__product-body-promotion">
                                <div class="checkout__product-body-electronic-invoice">
                                    <div class="checkout__product-body-invoice-sub">
                                        <span>Hoá đơn điện tử</span>
                                        <i class="uil uil-question-circle checkout__product-body-invoice-icon"></i>
                                    </div>
                                    <a href="" class="checkout__product-body-invoice-request">Yêu cầu ngay</a>
                                </div>
                                <div class="checkout__product-body-voucher">
                                    <div class="checkout__product-body-voucher-shop">
                                        <i class="uis uis-check-circle checkout__product-body-voucher-shop-icon"></i>
                                        Voucher của shop
                                    </div>
                                    <div class="checkout__product-body-voucher-other">
                                        <span>-18k</span>
                                        <a href="#" class="checkout__product-body-voucher-other-link">Chọn Voucher khác</a>
                                    </div>
                                </div>
                            </div>
                            <div class="checkout__product-body-contact">
                                <div class="checkout__product-body-message">
                                    <div class="checkout__product-body-message-content">
                                        <label for="" class="checkout__product-body-message-label">Lời nhắn</label>
                                        <input type="text" class="checkout__product-body-message-input"
                                            placeholder="Lưu ý cho người bán...">
                                    </div>
                                </div>
                                <div class="checkout__product-body-transport">
                                    <div class="checkout__product-body-transport-top">
                                        <div class="checkout__product-body-transport-sub">Đơn vị vận chuyển: </div>
                                        <div class="checkout__product-body-transport-type">
                                            <div class="checkout__product-body-transport-type-top">
                                                <span>Nhanh</span>
                                                <a href="#" class="checkout__product-body-transport-change">Thay đổi</a>
                                                <div class="checkout__product-body-transport-cost">${money(checkout[i][6])} đ</div>
                                            </div>
                                            <div class="checkout__product-body-transport-type-bottom">
                                                <div class="checkout__product-body-transport-type-bottom-sub">Đảm bảo nhận
                                                    hàng từ 16 Tháng 5 - 17 Tháng 5</div>
                                                <div class="checkout__product-body-transport-type-bottom-sub">Nhận Voucher
                                                    trị giá 10.000đ nếu đơn hàng được giao đến bạn sau ngày 17 Tháng 5 năm
                                                    2024. <i
                                                        class="uil uil-question-circle checkout__product-body-transport-type-bottom-icon"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="checkout__product-body-transport-between">
                                        <div class="checkout__product-body-transport-between-sub">Hoặc chọn phương thức Hoả
                                            Tốc để </div>
                                        <a href="#" class="checkout__product-body-transport-between-link">
                                            <i
                                                class="uil uil-truck checkout__product-body-transport-between-link-icon-truck"></i>
                                            <span>Đảm bảo nhận hàng vào hôm nay</span>
                                            <i
                                                class="uil uil-angle-right-b checkout__product-body-transport-between-link-row"></i>
                                        </a>
                                    </div>
                                    <div class="checkout__product-body-transport-bottom">
                                        <div class="checkout__product-body-transport-bottom-sub">
                                            <span>Được đồng kiểm</span>
                                            <i
                                                class="uil uil-question-circle checkout__product-body-transport-bottom-icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="checkout__product-bottom">
                            <div class="checkout__product-bottom-sub">Tổng số tiền (${checkout[i][4]} sản phẩm): </div>
                            <span>${money(checkout[i][5])} đ</span>
                        </div>
                    </div>
        `;
    }
    document.querySelector(".checkout__list").innerHTML = htmlCheckoutItem;
    setTotalPrice(checkout);
}

// Set Payment Type
function setPaymentsType(data) {
    if (data.paymentTypes.length == 0) {
        document.querySelector(".checkout__payment-header").innerHTML = 
        `
                    <div class="checkout__payment-header-sub">Phương thức thanh toán</div>
                    <a href="javascript:choosePaymentsType()" class="checkout__payment-header-change">Chọn phương thức thanh toán</a>
        `;
    } else {
        let htmlPaymentType = "";
        let htmlPaymentImage =
        `
            <img class="checkout__payment-sub-img" src="/img/${data.paymentTypes[0].sPaymentImage}">
        `;
        htmlPaymentType +=
        `
            <div class="checkout__payment-header-sub">Phương thức thanh toán</div>
        `;
        if (data.paymentTypes[0].pK_iPaymentID == 1) {
            htmlPaymentType +=
            `
                <div class="checkout__payment-header-cod-btn">Thanh toán khi nhận hàng (COD)</div>
            `;
        } else if (data.paymentTypes[0].pK_iPaymentID == 2) {
            htmlPaymentType +=
            `
                <div class="checkout__payment-header-paypal-btn">
                    <span>Pay</span> <span>Pal</span>
                </div>
            `;
        } else if (data.paymentTypes[0].pK_iPaymentID == 3) {
            htmlPaymentType +=
            `
                <div class="checkout__payment-header-vnpay-btn">
                    <span>VN</span><span>PAY</span>
                </div>
            `;
        } else if (data.paymentTypes[0].pK_iPaymentID == 4) {
            htmlPaymentType +=
            `
                <div class="checkout__payment-header-momo-btn">
                    MOMO
                </div>
            `;
        }
        htmlPaymentType +=
        `
            <a href="javascript:changePaymentType()" class="checkout__payment-header-change">Thay đổi</a>
        `;
        document.querySelector(".checkout__payment-header").innerHTML = htmlPaymentType;
        document.querySelector(".checkout__payment-sub-logo").innerHTML = htmlPaymentImage;
    }
}

function changePaymentType() {
    openModal();
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/checkout/get-data', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);

            console.log(data);

            let htmlPayment = "";
            htmlPayment +=
            `<div class="transport-form">
                <div class="transport-form__header">
                    <div class="transport-form__header-title">Cập nhật phương thức thanh toán</div>
                </div>
                <div class="transport-form__body">
                    <div class="transport-form__body-list">`;
            if (data.paymentTypes[0].pK_iPaymentID == 1) {
                        htmlPayment +=
                        `<div class="transport-form__body-item payment-form__body-item active">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-cod-btn">Thanh toán khi nhận hàng (COD)</div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>`;
            } else {
                        htmlPayment +=
                        `<div class="transport-form__body-item payment-form__body-item">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-cod-btn">Thanh toán khi nhận hàng (COD)</div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>`;
            }
            if (data.paymentTypes[0].pK_iPaymentID == 4) {
                        htmlPayment +=
                        `<div class="transport-form__body-item payment-form__body-item active">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-momo-btn">
                                        MOMO
                                    </div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>`;
            } else {
                        htmlPayment +=
                        `<div class="transport-form__body-item payment-form__body-item">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-momo-btn">
                                        MOMO
                                    </div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>`;
            }
                    htmlPayment +=
                    `</div>
                </div>
                <div class="transport-form__footer">
                    <div class="transport-form__btn btn" onclick="closeModal()">TRỞ LẠI</div>
                    <div class="transport-form__btn btn btn--primary">HOÀN THÀNH</div>
                </div>
            </div>`;
            document.querySelector(".modal__body").innerHTML = htmlPayment;
            const paymentItems = document.querySelectorAll(".payment-form__body-item");
            for (let i = 0; i < paymentItems.length; i++) {
                paymentItems[i].addEventListener('click', () => {
                    var paymentID;
                    if (i == 0) {
                        paymentItems[i].classList.add("active");
                        paymentItems[1].classList.remove("active");
                        paymentID = 1;
                        console.log("Cập nhật thanh toán COD");
                    } else if (i == 1) {
                        paymentItems[i].classList.add("active");
                        paymentItems[0].classList.remove("active");
                        console.log("Cập nhật thanh toán MOMO");
                        paymentID = 4;
                    } else if (i == 2) {
                        noticeIncompleteFunc()
                    } else if (i == 3) {
                        noticeIncompleteFunc()
                    }
                    var formData = new FormData();
                    formData.append("paymentID", paymentID);
                    var xhr = new XMLHttpRequest();
                    xhr.open('post', '/checkout/update-payment', true);
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            const data = JSON.parse(xhr.responseText);
                            console.log(data);
                            toast({ title: "Thông báo", msg: `${data.status.message}`, type: "success", duration: 5000 });
                            closeModal();
                            setPaymentsType(data);
                        }
                    };
                    xhr.send(formData);
                });
            }
            
        }
    };
    xhr.send(null);
    
}

function choosePaymentsType() {
    openModal();
    document.querySelector(".modal__body").innerHTML = 
    `
            <div class="transport-form">
                <div class="transport-form__header">
                    <div class="transport-form__header-title">Chọn phương thức thanh toán</div>
                </div>
                <div class="transport-form__body">
                    <div class="transport-form__body-list">
                        <div class="transport-form__body-item payment-form__body-item">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-cod-btn">Thanh toán khi nhận hàng (COD)</div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>
                        <div class="transport-form__body-item payment-form__body-item">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-momo-btn">
                                        MOMO
                                    </div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>
                        <div class="transport-form__body-item payment-form__body-item">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-vnpay-btn">
                                        <span>VN</span><span>PAY</span>
                                    </div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>
                        <div class="transport-form__body-item payment-form__body-item">
                            <div class="transport-form__body-item-left">
                                <div class="transport-form__body-item-name">
                                    <div class="checkout__payment-header-paypal-btn">
                                        <span>Pay</span> <span>Pal</span>
                                    </div>
                                </div>
                            </div>
                            <div class="transport-form__body-item-right">
                                <i class="uil uil-check"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transport-form__footer">
                    <div class="transport-form__btn btn" onclick="closeModal()">TRỞ LẠI</div>
                    <div class="transport-form__btn btn btn--primary">HOÀN THÀNH</div>
                </div>
            </div>
    `;

    const paymentItems = document.querySelectorAll(".payment-form__body-item");
    for (let i = 0; i < paymentItems.length; i++) {
        paymentItems[i].addEventListener('click', () => {
            var paymentID;
            if (i == 0) {
                paymentItems[i].classList.add("active");
                paymentItems[1].classList.remove("active");
                paymentItems[2].classList.remove("active");
                paymentItems[3].classList.remove("active");
                paymentID = 1;
                console.log("Thanh toán COD");
            } else if (i == 1) {
                paymentItems[i].classList.add("active");
                paymentItems[0].classList.remove("active");
                paymentItems[2].classList.remove("active");
                paymentItems[3].classList.remove("active");
                console.log("Thanh toán MOMO");
                paymentID = 4;
            } else if (i == 2) {
                noticeIncompleteFunc()
            } else if (i == 3) {
                noticeIncompleteFunc()
            }
            var formData = new FormData();
            formData.append("paymentID", paymentID);
            var xhr = new XMLHttpRequest();
            xhr.open('post', '/checkout/add-payment', true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    const data = JSON.parse(xhr.responseText);
                    console.log(data);
                    toast({title: "Thông báo", msg: `${data.status.message}`, type: "success", duration: 5000});
                    closeModal();
                    setPaymentsType(data);
                }
            };
            xhr.send(formData);
        });
    }
}

// Set Price
function setTotalPrice(checkout) {
    var totalItemPrice = checkout.reduce((total, item) => {
        return total + item[5];
    }, 0);

    var totalTransportPrice = checkout.reduce((total, transport) => {
        return total + transport[6];
    }, 0);

    document.querySelector(".checkout__payment-money-total-item-price").innerText = `${money(totalItemPrice)}`;
    document.querySelector(".checkout__payment-money-total-transport-price").innerText = `${money(totalTransportPrice)}`;
    document.querySelector(".checkout__payment-money-total-price").innerText = `${money(totalItemPrice + totalTransportPrice)}`;
    
    var totalPrice = totalItemPrice + totalTransportPrice;
    addToOrder(totalPrice);
}

// Add To Order
function addToOrder(totalPrice) {
    let userID = getCookies("userID");
    if (userID == undefined) {
        userID = 0;
    }

    document.querySelector(".checkout__payment-order-btn-submit").addEventListener("click", () => {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/checkout/get-data?userID=' + userID + '', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.paymentTypes.length == 0) {
                    console.log("Chưa có phương thức thanh toán");
                    openModal();
                    document.querySelector(".modal__body").innerHTML = 
                        `<div class="modal__confirm">
                            <div class="modal__confirm-header">
                                <div class="modal__confirm-title">Thông báo</div>
                                <i class="uil uil-multiply modal__confirm-close" onclick="closeModal()"></i>
                            </div>
                            <div class="modal__confirm-desc">
                                Bạn chưa chọn phương thức thanh toán!
                            </div>
                            <div class="modal__confirm-btns">
                                <div class="modal__confirm-btn-destroy" onclick="closeModal()">Huỷ</div>
                                <div class="modal__confirm-btn-send"onclick="choosePaymentsType()">Chọn phương thức thanh toán</div>
                            </div>
                        </div>`;
                } else {
                    const paymentTypeID = data.paymentTypes[0].pK_iPaymentTypeID;
                    const paymentID = data.paymentTypes[0].pK_iPaymentID;
                    addOrder(totalPrice, paymentTypeID, paymentID);
                }
            }
        };
        xhr.send(null);
    });
}

function addOrder(totalPrice, paymentTypeID, paymentID) {
    var formData = new FormData();
    formData.append("userID", getCookies("userID"));
    formData.append("shopID", sessionStorage.getItem("shopID"));
    formData.append("totalPrice", totalPrice);
    formData.append("paymentTypeID", paymentTypeID);
    formData.append("paymentID", paymentID);
    formData.append("orderStatusID", 2);

    var xhr = new XMLHttpRequest();
    xhr.open('post', '/checkout/add-to-order', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const result = JSON.parse(xhr.responseText);

            console.log(result);

            addToOrderDetail(result.orderID);
        }
    };
    xhr.send(formData);
}

function addToOrderDetail(orderID) {
    var checkout = JSON.parse(sessionStorage.getItem("checkout"));
    for (let i = 0; i < checkout.length; i++) {
        var formData = new FormData();
        formData.append("userID", getCookies("userID"));
        formData.append("orderID", orderID);
        formData.append("productID", checkout[i][0]);
        formData.append("quantity", checkout[i][4]);
        formData.append("price", checkout[i][3]);
        formData.append("money", checkout[i][5]);

        var xhr = new XMLHttpRequest();
        xhr.open('post', '/checkout/add-to-order-detail', true);
        xhr.send(formData);
    }
    sessionStorage.removeItem("checkout");
    toast({ title: "Thông báo", msg: `Đặt hàng thành công!`, type: "success", duration: 5000 });
    if (data.paymentTypes[0].pK_iPaymentID == 4) {
        window.location.assign("/payment/momo");
    } else {
        window.location.assign("/user/purchase");
    }
}

// JS Mobile
function setCheckoutMobile(data) {
    let htmlCheckoutMobile = "";
    htmlCheckoutMobile += 
            `<div class="checkout-mobile__address">`;
            if (data.addresses.length == 0) {

            } else {
                htmlCheckoutMobile += 
                `<div class="checkout-mobile__address-destination">
                    <i class="uil uil-map-marker checkout-mobile__address-destination-icon"></i>
                </div>
                <div class="checkout-mobile__address-desc">
                    <div class="checkout-mobile__address-desc-title">Địa chỉ nhận hàng</div>
                    <span class="checkout-mobile__address-desc-name">${data.addresses[0].sFullName}</span> <span
                        class="checkout-mobile__address-desc-divide">|</span>
                    <span class="checkout-mobile__address-desc-phone">(+84) ${data.addresses[0].sPhone}</span>
                    <div class="checkout-mobile__address-desc-direction">${data.addresses[0].sAddress}</div>
                </div>
                <div class="checkout-mobile__address-more" onclick="openAddressFormMobile()">
                    <i class="uil uil-angle-right-b checkout-mobile__address-more-icon"></i>
                </div>`;
            }
            htmlCheckoutMobile += `
            </div>
            <div class="address-form-mobile hide-on-mobile">
                <div class="address-form-mobile__header">
                    <div class="address-form-mobile__header-back" onclick="closeAddressFormMobile()">
                        <i class="uil uil-arrow-left address-form-mobile__header-back-icon"></i>
                    </div>
                    <div class="address-form-mobile__header-title">Địa chỉ nhận hàng</div>
                </div>
                <div class="address-form-mobile__search">
                    <input type="text" class="address-form-mobile__search-input" placeholder="Tìm Thành phố, Quận/Huyện">
                </div>
                <div class="address-form-mobile__body">
                    <div class="address-form-mobile__body-title">Địa chỉ của tôi</div>
                    <div class="address-form-mobile__body-list">
                        <ul class="address-form__list">`;
                        for (let i = 0; i < data.addresses.length; i++) {
                            if (data.addresses[i].iDefault == 1) {
                                htmlCheckoutMobile += 
                            `<li class="address-form__item default">
                                <div class="address-form__item-box">
                                    <input type="radio" name="address" class="address-form__item-input" checked>
                                </div>
                                <div class="address-form__item-content">
                                    <div class="address-form__item-header">
                                        <div class="address-form__item-header-info">
                                            <div class="address-form__item-name">${data.addresses[i].sFullName}</div>
                                            <div class="address-form__item-phone">(+84) ${data.addresses[i].sPhone}</div>
                                        </div>
                                    </div>
                                    <div class="address-form__item-body">
                                        <div class="address-form__item-body-row">${data.addresses[i].sAddress}</div>
                                    </div>
                                    <button class="address-form__item-sub">Mặc định</button>
                                </div>
                            </li>`;
                            }
                        }
                        htmlCheckoutMobile += `
                        </ul>
                    </div>
                    <div class="address-form-mobile__body-add">
                        <i class="uil uil-plus-circle address-form-mobile__body-add-icon"></i>
                        <div class="address-form-mobile__body-add-sub">Thêm địa chỉ</div>
                        <div class="address-form-mobile__body-add-more">
                            <i class="uil uil-angle-right-b address-form-mobile__body-add-more"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="checkout-mobile__lable">
                <div class="checkout-mobile__lable-box"></div>
            </div>
            <div class="checkout-mobile__list">`;
            var checkout = JSON.parse(sessionStorage.getItem("checkout"));
            for (let i = 0; i < checkout.length; i++) {
                htmlCheckoutMobile += 
                `<div class="checkout-mobile__item">
                    <div class="checkout-mobile__item-header">
                        <div class="checkout-mobile__item-header-favorite">Yêu thích</div>
                        <div class="checkout-mobile__item-header-shop">Viet Mark</div>
                    </div>
                    <div class="checkout-mobile__item-product">
                        <div class="checkout-mobile__item-product-thumb">
                            <img class="checkout-mobile__item-product-img" src="/img/${checkout[i][2]}" />
                        </div>
                        <div class="checkout-mobile__item-product-info">
                            <div class="checkout-mobile__item-product-info-name">
                            ${checkout[i][1]}
                            </div>
                            <div class="checkout-mobile__item-product-bottom">
                                <div class="checkout-mobile__item-product-bottom-change">
                                    <span>Đổi ý miễn phí</span>
                                </div>
                                <div class="checkout-mobile__item-product-numb">
                                    <div class="checkout-mobile__item-product-numb-qunatity">x${checkout[i][4]}</div>
                                    <div class="checkout-mobile__item-product-numb-price">${money_2(checkout[i][3])}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="checkout-mobile__item-product-voucher">
                        <div class="checkout-mobile__item-product-voucher-left">
                            <i class="uil uil-ellipsis-v checkout-mobile__item-product-voucher-icon-sub"></i>
                            <div class="checkout-mobile__item-product-voucher-sub">Voucher của Shop</div>
                        </div>
                        <div class="checkout-mobile__item-product-voucher-right">
                            <div class="checkout-mobile__item-product-voucher-choose">Chọn Voucher</div>
                            <i class="uil uil-angle-right-b checkout-mobile__item-product-voucher-icon-choose"></i>
                        </div>
                    </div>
                    <div class="checkout-mobile__item-product-transport">
                        <div class="checkout-mobile__item-product-transport-header">Vận chuyển</div>
                        <div class="checkout-mobile__item-product-transport-type">
                            <div class="checkout-mobile__item-product-transport-type-sub">Nhanh</div>
                            <div class="checkout-mobile__item-product-transport-type-price">${money_2(checkout[i][6])}</div>
                        </div>
                        <div class="checkout-mobile__item-product-transport-time">Nhận hàng vào 7 Tháng 7 - 8 Tháng 7
                        </div>
                        <div class="checkout-mobile__item-product-transport-express">
                            <div class="checkout-mobile__item-product-transport-express-sub">Hoặc chọn Hoả tốc để </div>
                            <a href="#" class="checkout-mobile__item-product-transport-express-link">
                                <i class="uil uil-truck"></i>
                                <span>Nhận hàng vào hôm nay</span>
                                <i
                                    class="uil uil-angle-right-b checkout-mobile__item-product-transport-express-icon-more"></i>
                            </a>
                        </div>
                        <div class="checkout-mobile__item-product-transport-inspection">
                            <span>Được đồng kiểm.</span>
                            <i
                                class="uil uil-question-circle checkout-mobile__item-product-transport-inspection-icon"></i>
                        </div>
                    </div>
                    <div class="checkout-mobile__item-product-message">
                        <div class="checkout-mobile__item-product-message-sub">Tin nhắn:</div>
                        <input type="text" class="checkout-mobile__item-product-message-input"
                            placeholder="Để lại lời nhắn">
                    </div>
                    <div class="checkout-mobile__item-product-into-money">
                        <div class="checkout-mobile__item-product-into-money-sub">Thành tiền (${checkout[i][4]} sản phẩm):</div>
                        <div class="checkout-mobile__item-product-into-money-price">${money_2(checkout[i][5])}</div>
                    </div>
                </div>`;
            }
            htmlCheckoutMobile += `
            </div>
            <div class="checkout-mobile__voucher">
                <div class="checkout-mobile__voucher-col">
                    <i class="uil uil-ellipsis-v checkout-mobile__voucher-sub-icon"></i>
                    <div class="checkout-mobile__voucher-title">Shopee Voucher</div>
                </div>
                <div class="checkout-mobile__voucher-col">
                    <div class="checkout-mobile__voucher-choose">Chọn Voucher</div>
                    <i class="uil uil-angle-right-b checkout-mobile__voucher-choose-icon"></i>
                </div>
            </div>
            <div class="checkout-mobile__type">
                <div class="checkout-mobile__type-header">
                    <div class="checkout-mobile__type-header-col">
                        <i class="uil uil-usd-circle checkout-mobile__type-header-sub-icon"></i>
                        <div class="checkout-mobile__type-header-sub">Lựa chọn thanh toán</div>
                    </div>
                    <div class="checkout-mobile__type-header-col">
                        <div class="checkout-mobile__type-header-sub">${data.paymentTypes[0].sPaymentName}</div>
                        <i class="uil uil-angle-right-b checkout-mobile__type-header-icon"></i>
                    </div>
                </div>
                <div class="checkout-mobile__type-pay">
                    Dùng ShopeePay để tận hưởng nhiều voucer ưu đãi.
                </div>
            </div>
            <div class="checkout-mobile__detail">
                <div class="checkout-mobile__detail-header">
                    <i class="uil uil-notes checkout-mobile__detail-header-icon"></i>
                    <div class="checkout-mobile__detail-header-sub">Chi tiết thanh toán</div>
                </div>
                <div class="checkout-mobile__detail-body">
                    <div class="checkout-mobile__detail-total-price-product">
                        <div class="checkout-mobile__detail-total-price-product-sub">Tổng tiền hàng</div>
                        <div class="checkout-mobile__detail-total-price-product-numb">${money_2(checkout.reduce((totalMoney, a) => totalMoney + a[5], 0))}</div>
                    </div>
                    <div class="checkout-mobile__detail-transport-price">
                        <div class="checkout-mobile__detail-transport-price-sub">Phí vận chuyển</div>
                        <div class="checkout-mobile__detail-transport-price-numb">${money_2(checkout.reduce((totalMoney, a) => totalMoney + a[6], 0))}</div>
                    </div>
                </div>
                <div class="checkout-mobile__detail-bottom">
                    <div class="checkout-mobile__detail-bottom-sub">Thành tiền</div>
                    <div class="checkout-mobile__detail-bottom-price">${money_2(checkout.reduce((totalMoney, a) => totalMoney + a[5], 0) + checkout.reduce((totalMoney, a) => totalMoney + a[6], 0))}</div>
                </div>
            </div>
            <div class="checkout-mobile__rules">
                <i class="uil uil-newspaper checkout-mobile__rules-icon"></i>
                <div class="checkout-mobile__rules-sub">
                    Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <a href="#"
                        class="checkout-mobile__rules-link">Điều khoản SMe</a>
                </div>
            </div>
            <div class="checkout-mobile__footer">
                <div class="checkout-mobile__footer-into-money">
                    <div class="checkout-mobile__footer-into-money-sub">Thành tiền</div>
                    <div class="checkout-mobile__footer-into-money-numb">${money_2(checkout.reduce((totalMoney, a) => totalMoney + a[5], 0) + checkout.reduce((totalMoney, a) => totalMoney + a[6], 0))}</div>
                </div>
                <div class="checkout-mobile__footer-btn">
                    Đặt hàng
                </div>
            </div>`;
    document.querySelector(".checkout-mobile").innerHTML = htmlCheckoutMobile;
}

function openAddressFormMobile() {
    document.querySelector(".address-form-mobile").classList.remove("hide-on-mobile");
}

function closeAddressFormMobile() {
    document.querySelector(".address-form-mobile").classList.add("hide-on-mobile");
}

// Modal
function openModal() {
    document.querySelector(".modal").classList.add("open");
}

function closeModal() {
    document.querySelector(".modal").classList.remove("open");
}

function getCookies(userID) {
    const id = userID + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const arr = cDecoded.split(";");
    let res; 
    arr.forEach(val => {
        if (val.indexOf(id) === 0) res = val.substring(id.length);
    });
    return res;
}