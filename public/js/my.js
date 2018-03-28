'use strict';

var app = angular.module('app', ['ngRoute']);

const socket = io.connect({
    secure: true
});

//  global
var currentUser = {};
var currentLimit = 8;
var countForServer = 4;

function RequiredFieldAlert(message) {
    if (message === undefined) {
        $("#modalHeaderTextMessage").html("Type required fields");
        $("#modalTypeRequiredFields").modal();
    } else {
        $("#modalHeaderTextMessage").html(message);
        $("#modalTypeRequiredFields").modal();
    }
}
//  (end) global

//  clear url and %2F, #
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
}]);

//  create an address
app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    })
})

app.controller("myCtrl", function ($scope) {

    let countOfGoodsObj = {
        count: currentLimit
    };

    $(document).ready(function () {
        socket.emit("goodsByCount", countOfGoodsObj);
        socket.on("getResGoodsByCount", function (data) {
            $scope.listOfGoods = data;
            $scope.$digest();
        });
    });

});

//Директива Нагадування паролю
app.directive('forgetBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/forget.html',
        controller: function ($scope) {

            //Кидаєм на сервер пошту для відправки забутого паролю
            $scope.remind = function () {
                if ($scope.remindMail === undefined) {
                    RequiredFieldAlert();
                    return;
                }
                socket.emit("remindPassword", $scope.remindMail);
            }

            socket.on("getResRemindPassword", function (data) {
                RequiredFieldAlert(data);
            })
        }
    }
});

app.directive("headerBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/header.html',
        controller: function ($scope) {
            $scope.homeStatus = true;
            $scope.page1Status = false;
            $scope.page2Status = false;
            $scope.page3Status = false;
            $scope.registrationStatus = false;
            $scope.forgetPasswordStatus = false;
            $scope.cartStatus = false;
            $scope.footerStatus = true;
            $scope.contactUsStatus = false;
            $scope.adminStatus = false;
            $scope.loginPageStatus = false;

            $(".navbar").css({
                backgroundColor: "transparent"
            })

            $(".footer").css({
                backgroundColor: "transparent"
            })

            //  save user in localStorage
            if (localStorage.userName != 'default') {
                if (localStorage.userName != undefined) {
                    $scope.isLogOut = true;
                    $scope.isLoginUserName = true;
                    $scope.isLogin = false;
                    $scope.currentHeaderUserName = localStorage.userName;
                    currentUser = localStorage.currentUser;

                    if (localStorage.userName === "admin") {
                        $scope.isAdminLogin = true;
                    }

                } else {
                    localStorage.userName = 'default';
                    localStorage.currentUser = {};
                    $scope.isLogOut = false;
                    $scope.isLoginUserName = false;
                    $scope.isAdminLogin = false;
                    $scope.isLogin = true;
                }
            } else {
                $scope.isLogOut = false;
                $scope.isLoginUserName = false;
                $scope.isAdminLogin = false;
                $scope.isLogin = true;
            }

            //  Chat
            if (localStorage.userName != "default") {
                socket.emit("setRoom", localStorage.userName);
                socket.emit("getListOfUser", localStorage.userName);
                socket.emit("getListOfChatMessages", localStorage.userName);
                socket.emit("getListOfAllChatMessagesForAdmin", localStorage.userName);
                $scope.chatUserNameInput = localStorage.userName;
            }
            //  (end) Chat

            //  (end) save user in localStorage

            $scope.chooseHome = function () {
                $scope.homeStatus = true;
                $scope.page1Status = false;
                $scope.page2Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = false;
                $scope.contactUsStatus = false;
                $scope.adminStatus = false;
                $scope.loginPageStatus = false;

                $(".navbar").css({
                    backgroundColor: "transparent"
                })

                $(".footer").css({
                    backgroundColor: "transparent"
                })
            }

            $scope.choosePage1 = function () {
                $scope.homeStatus = false;
                $scope.page1Status = true;
                $scope.page2Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = false;
                $scope.contactUsStatus = false;
                $scope.adminStatus = false;
                $scope.loginPageStatus = false;

                $scope.allItems = true;
                $scope.singleItem = false;

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.chooseContactUs = function () {
                $scope.homeStatus = false;
                $scope.page1Status = false;
                $scope.page2Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = false;
                $scope.contactUsStatus = true;
                $scope.adminStatus = false;
                $scope.loginPageStatus = false;

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.chooseAdminPanel = function () {
                $scope.homeStatus = false;
                $scope.page1Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = false;
                $scope.contactUsStatus = false;
                $scope.adminStatus = true;
                $scope.loginPageStatus = false;

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.choosePage3 = function () {
                $scope.homeStatus = false;
                $scope.page1Status = false;
                $scope.page2Status = false;
                $scope.page3Status = true;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = false;
                $scope.contactUsStatus = false;
                $scope.adminStatus = false;
                $scope.loginPageStatus = false;

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.chooseRegistrationWindow = function () {
                $scope.homeStatus = false;
                $scope.page1Status = false;
                $scope.page2Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = true;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = false;
                $scope.contactUsStatus = false;
                $scope.adminStatus = false;
                $scope.loginPageStatus = false;

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.chooseLogin = function () {
                $scope.homeStatus = false;
                $scope.page1Status = false;
                $scope.page2Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = false;
                $scope.contactUsStatus = false;
                $scope.adminStatus = false;
                $scope.loginPageStatus = true;

                $("#loginPageBlock").css({
                    left: "-9999px"
                });

                $("#loginPageBlock").animate({
                    left: "0"
                });

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.chooseSubmitCartReq = function () {
                $("#submitCartModalWindow").modal();
                currentUser = JSON.parse(localStorage.currentUser);
                if (currentUser.id !== undefined) {
                    $scope.FirstUserName = currentUser.name;
                    $scope.SecondUserName = "---";
                    $scope.UserPhone = "---"
                    $scope.UserEmail = currentUser.email;
                    $scope.UserCity = "---";
                } else {
                    $scope.FirstUserName = "";
                    $scope.SecondUserName = "";
                    $scope.UserPhone = "";
                    $scope.UserEmail = "";
                    $scope.UserCity = "";
                }

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.chooseForgetPassword = function () {
                $scope.homeStatus = false;
                $scope.page1Status = false;
                $scope.page2Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = true;
                $scope.cartStatus = false;
                $scope.contactUsStatus = false;
                $scope.adminStatus = false;
                $scope.loginPageStatus = false;

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

            $scope.chooseCart = function () {
                $scope.homeStatus = false;
                $scope.page1Status = false;
                $scope.page2Status = false;
                $scope.page3Status = false;
                $scope.registrationStatus = false;
                $scope.forgetPasswordStatus = false;
                $scope.cartStatus = true;
                $scope.contactUsStatus = false;
                $scope.adminStatus = false;
                $scope.loginPageStatus = false;

                $(".navbar").css({
                    backgroundColor: "black"
                })

                $(".footer").css({
                    backgroundColor: "black"
                })
            }

        }
    }
});

app.directive("homeBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/home.html',
    }
});

app.directive("page1Block", function () {
    return {
        replace: 'true',
        templateUrl: 'template/page1.html'
    }
});

app.directive("page2Block", function () {
    return {
        replace: 'true',
        templateUrl: 'template/page2.html',
        controller: function ($scope) {
            socket.emit("messages");
            socket.on("resGetMessages", function (data) {
                $scope.listOfContactMessages = data;
            });
        }
    }
});

app.directive("page3Block", function () {
    return {
        replace: 'true',
        templateUrl: 'template/page3.html'
    }
});

app.directive("submitordermodalwindowBlock", function () {
    return {
        replace: true,
        templateUrl: 'template/submitOrderModalWindow.html'
    }
});

app.directive("loginBlock", function () {
    return {
        replace: true,
        templateUrl: 'template/login.html',
        controller: function ($scope) {

            //  height of the login Page Block
            $("#loginPageBlock").css('height', window.innerHeight + "px");
            $(".bg__login____img").css('height', window.innerHeight + "px");

            //  Залогінитись
            $scope.check = function () {
                if (($scope.inputLoginModel == "") || ($scope.inputLoginModel === undefined) ||
                    ($scope.inputPasswordModel == "") || ($scope.inputPasswordModel === undefined)) {
                    RequiredFieldAlert();
                    return;
                }

                let obj = {
                    login: $scope.inputLoginModel,
                    password: $scope.inputPasswordModel
                }

                socket.emit("userLogin", obj);
            }

            socket.on("getResUserLogin", function (data) {
                if ((data == "Wrong Password") || (data == "Wrong Login")) {
                    RequiredFieldAlert(data);
                } else {
                    $scope.isLogOut = true;
                    $scope.isLoginUserName = true;
                    $scope.isLogin = false;
                    localStorage.userName = $scope.inputLoginModel;
                    $scope.currentHeaderUserName = localStorage.userName;

                    if (localStorage.userName === "admin") {
                        $scope.isAdminLogin = true;
                    }

                    $("#loginModalWindow").modal("hide");

                    currentUser = JSON.parse(data);
                    localStorage.currentUser = JSON.stringify(currentUser);
                    RequiredFieldAlert('Welcome ' + currentUser.name);

                    //  Chat
                    if (localStorage.userName != "default") {
                        socket.emit("setRoom", localStorage.userName);
                        socket.emit("getListOfUser", localStorage.userName);
                        socket.emit("getListOfChatMessages", localStorage.userName);
                        $scope.chatUserNameInput = localStorage.userName;
                        socket.emit("getListOfAllChatMessagesForAdmin", localStorage.userName);
                        $scope.$digest();
                    }
                    //  (end) Chat

                    $scope.chooseHome();
                }
            });

            //  Розлогуватись
            $scope.chooseLogOut = function () {
                $("#modelLogOutBtn").modal();
            }

            $scope.ConfirmUserLogIn = function () {
                localStorage.userName = 'default';
                localStorage.currentUser = JSON.stringify({});
                $scope.isLogOut = false;
                $scope.isLoginUserName = false;
                $scope.isLogin = true;
                $scope.login = "";
                $scope.password = "";
                $scope.isAdminLogin = false;

                //  chat
                $scope.listOfChatMessages = [];
                $scope.chatUserNameInput = "";
            }

        }
    }
});

app.directive("registrationBlock", function () {
    return {
        replace: true,
        templateUrl: 'template/registration.html',
        controller: function ($scope) {
            $scope.chooseRegistration = function () {
                let newUserObj = {
                    name: newName.value,
                    login: newLogin.value,
                    password: newPassword.value,
                    email: newEmail.value,
                    verCode: $("#newUserVerCode").val()
                }
                socket.emit("signUp", newUserObj);
            }

            socket.on("getResSignUp", function (data) {
                RequiredFieldAlert(data);
                if (data != "Error ver. code" && data != "pls choose another login") {
                    $scope.choosePage1();

                }
                $scope.$digest();
            })

            $scope.verification = function () {
                let obj = {
                    phone: $("#newUserPhone").val()
                }
                socket.emit("verificationCode", obj);
            }

            socket.on("getResVerificationCode", function (data) {
                console.log(data);
            });
        }
    }
});

app.directive("sliderBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/slider.html',
        controller: function ($scope) {
            var slideNow = 1;
            var slideCount = $('#slidewrapper').children().length;
            var slideInterval = 3000;
            var navBtnId = 0;
            var translateWidth = 0;
            var speed = '500ms';

            //  bg for radio btn of first selected slide
            document.getElementsByClassName("slide-nav-btn")[0].style.backgroundColor = "white";

            var playing = false;
            var switchInterval;

            autoSlider.onclick = function () {
                if (playing) {
                    playing = false;
                    clearInterval(switchInterval);
                    autoSlider.innerHTML = "Play";
                } else {
                    playing = true;
                    switchInterval = setInterval(NextSlide, slideInterval);
                    autoSlider.innerHTML = "Stop";
                }
            }

            $(document).ready(function () {
                MediaSrcController();

                //  height of the slides
                $("#viewport").css('height', 273 + "px");

                //  width of the slide wrapper
                $("#slidewrapper").css('width', 'calc(100% * ' + slideCount + ')');

                //  width of the one slide
                $(".slide").css('width', 'calc(100% / ' + slideCount + ')');

                $('#next-btn').click(function () {
                    NextSlide();
                });

                $('#prev-btn').click(function () {
                    PrevSlide();
                });

                $('.slide-nav-btn').click(function () {
                    navBtnId = $(this).index();

                    if (navBtnId + 1 != slideNow) {
                        translateWidth = -$('#viewport').width() * (navBtnId);
                        $('#slidewrapper').css({
                            'transform': 'translate(' + translateWidth + 'px, 0)',
                            '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                            '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
                            'transition-duration': speed
                        });
                        slideNow = navBtnId + 1;

                        IsSlideChecked();
                        MediaSrcController();
                    }
                });

                for (var i = 1; i <= 5; i++) {
                    $('.slide-nav-btn:nth-child(' + i + ')').tooltip({
                        title: '<img style="object-fit: fill; width: 100%;" src="img/slider/' + i + '.jpg">',
                        html: true,
                        placement: "top",
                        trigger: "hover"
                    });
                }
            });

            function NextSlide() {
                if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
                    $('#slidewrapper').css('transform', 'translate(0, 0)');
                    slideNow = 1;
                } else {
                    translateWidth = -$('#viewport').width() * (slideNow);
                    $('#slidewrapper').css({
                        'transform': 'translate(' + translateWidth + 'px, 0)',
                        '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                        '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
                        'transition-duration': speed
                    });
                    slideNow++;
                }
                IsSlideChecked();
                MediaSrcController();
            }

            function PrevSlide() {
                if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
                    translateWidth = -$('#viewport').width() * (slideCount - 1);
                    $('#slidewrapper').css({
                        'transform': 'translate(' + translateWidth + 'px, 0)',
                        '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                        '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
                        'transition-duration': speed
                    });
                    slideNow = slideCount;
                } else {
                    translateWidth = -$('#viewport').width() * (slideNow - 2);
                    $('#slidewrapper').css({
                        'transform': 'translate(' + translateWidth + 'px, 0)',
                        '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                        '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
                        'transition-duration': speed
                    });
                    slideNow--;
                }
                IsSlideChecked();
                MediaSrcController();
            }


            function MediaSrcController() {

                //  load img form (for ex.) '3' in slider of if pres radio '4'
                ImageLoader();
            }

            let isImg4 = false;
            let isImg5 = false;

            function ImageLoader() {
                for (var i = 1; i <= slideCount; i++) {
                    //  set 4
                    if (i == 3 && i == slideNow && !isImg4) {
                        $('.slide:nth-child(' + (i + 1) + ')').children('img').attr("src", "img/slider/4.jpg");
                        isImg4 = true;
                    } else if (i == 4 && i == slideNow && !isImg4) {
                        $('.slide:nth-child(' + i + ')').children('img').attr("src", "img/slider/4.jpg");
                        isImg4 = true;
                    }

                    //  set 5
                    if (i == 4 && i == slideNow && !isImg5) {
                        $('.slide:nth-child(' + (i + 1) + ')').children('img').attr("src", "img/slider/5.jpg");
                        isImg5 = true;
                    } else if (i == 5 && i == slideNow && !isImg5) {
                        $('.slide:nth-child(' + i + ')').children('img').attr("src", "img/slider/5.jpg");
                        isImg5 = true;
                    }
                }
            }

            function IsSlideChecked() {
                document.getElementsByClassName("slide-nav-btn")[slideNow - 1].checked = true;
                document.getElementsByClassName("slide-nav-btn")[slideNow - 1].style.backgroundColor = "white";

                for (var i = 0; i < slideCount; i++) {
                    if ((slideNow - 1) != i) {
                        document.getElementsByClassName("slide-nav-btn")[i].style.backgroundColor = "transparent";
                    }
                }
            }
        }
    }
});

app.directive("chatBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/chat.html',
        controller: function ($scope) {
            $scope.selectedChatUser = "admin";
            $scope.listOfAllChatMessagesForAdmin = [];

            setTimeout(function () {
                socket.emit("getListOfUser", localStorage.userName);
                socket.emit("getListOfAllChatMessagesForAdmin", localStorage.userName);
            });

            $scope.SendMessageToFirebaseServer = function () {
                if (localStorage.userName !== "default") {
                    if ($scope.messageText !== undefined && $scope.chatUserNameInput !== undefined) {

                        // Create new or select room by "localStorage.userName" 
                        socket.emit("setRoom", localStorage.userName);
                        socket.emit("sendMessageToServer", {
                            room: localStorage.userName,
                            name: $scope.chatUserNameInput,
                            message: $scope.messageText,
                            date: Date.now()
                        });
                        $scope.messageText = "";
                    } else {
                        RequiredFieldAlert();
                    }
                } else {
                    RequiredFieldAlert("Login please");
                }
            }

            //  Admin part
            $scope.GetChatByUser = function (user) {
                $scope.selectedChatUser = user;

                //  Get messages by selected user
                $scope.ArrayOfUserMessages = $scope.listOfAllChatMessagesForAdmin[user];
            }

            $scope.SendMessageByAdmin = function () {

                // Has hard code for `admin`
                // Create new or select room by "selectedChatUser" 
                socket.emit("setRoom", $scope.selectedChatUser);
                socket.emit("sendMessageToServer", {
                    room: $scope.selectedChatUser,
                    name: $("#inputClientUser").val(),
                    message: $("#inputText").val(),
                    date: Date.now()
                });
                $scope.messageText = "";
            }

            socket.on("resGetListOfUser", function (data) {

                //  Get list of users (rooms)
                $scope.listOfUserForChat = Object.keys(data);
                $scope.$digest();
            });

            socket.on("resGetListOfMessages", function (data) {

                //  Get messages form main chat
                $scope.listOfChatMessages = data;

                //  Get all chat messages
                $scope.listOfAllChatMessagesForAdmin = data;

                //  Get messages by selected user
                $scope.ArrayOfUserMessages = data[$scope.selectedChatUser];
                $scope.$digest();
            });

            socket.on("resGetListOfAllChatMessagesForAdmin", function (data) {

                //  Get all chat messages
                $scope.listOfAllChatMessagesForAdmin = data;

                //  Get messages by selected user
                $scope.ArrayOfUserMessages = data[$scope.selectedChatUser];
                $scope.$digest();
            });


            let isChatClosed = true;
            $scope.OpenCloseChatBtn = function () {
                if (isChatClosed) {
                    $("#firebaseChatBlock").animate({
                        right: "10px"
                    });
                    isChatClosed = false;
                } else {
                    $("#firebaseChatBlock").animate({
                        right: "-599px"
                    });
                    isChatClosed = true;
                }
            }

        }
    }
});

app.directive("contentBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/content.html'
    }
});

app.directive("previewcartBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/cartPreview.html'
    }
});

app.directive("cartBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/cart.html',
        controller: function ($scope) {
            $scope.cartListOfGoods = [];
            $scope.countOfGoods = 0;

            if (localStorage.cartList != undefined) {
                $scope.cartListOfGoods = JSON.parse(localStorage.cartList);
                $scope.countOfGoods = parseInt(localStorage.countOfGoods);

                PriceSum();
            } else {
                $scope.cartListOfGoods = [];
                $scope.countOfGoods = 0;

                $scope.statusCartTable = false;
                $scope.statusCartEmpty = true;
            }

            $scope.addGoodItemToCart = function (id) {
                if ($scope.cartListOfGoods.find(i => i.id === id) === undefined) {
                    $scope.listOfGoods.find(i => i.id === id).countOfOneGood = 1;
                    $scope.cartListOfGoods.push($scope.listOfGoods.find(i => i.id === id));
                } else {
                    $scope.listOfGoods.find(i => i.id === id).countOfOneGood = $scope.cartListOfGoods.find(i => i.id === id).countOfOneGood += 1;
                }

                $scope.countOfGoods = ++($scope.countOfGoods);

                LocalStorageCartData();
                PriceSum();
            }

            $scope.sendCartToAdmin = function () {
                var currentOrder = [];
                for (var i = 0; i < $scope.cartListOfGoods.length; i++) {
                    var currentGood = {
                        id: $scope.cartListOfGoods[i].id,
                        count: $scope.cartListOfGoods[i].countOfOneGood
                    };
                    currentOrder.push(currentGood);
                }

                let userInfo = {
                    cartListOfGoodsforAdmin: $scope.cartListOfGoods,
                    firstName: $("#inputFirstUserName").val(),
                    secondName: $("#inputSecondUserName").val(),
                    phone: $("#inputUserPhone").val(),
                    email: $("#inputUserEmail").val(),
                    city: $("#inputUserCity").val(),
                    address: $("#inputUserAddress").val(),
                    additionalInformation: $("#inputUserAdditionalInformation").val(),
                    orderGoodsCount: currentOrder
                };

                socket.emit("sendCart", userInfo);

                $scope.cartListOfGoods = [];
                $scope.countOfGoods = 0;
                LocalStorageCartData();
                PriceSum();
            }

            socket.on("getResSendCart", function (data) {
                RequiredFieldAlert(data);
            });

            $scope.deleteFromCart = function (id) {
                $scope.countOfGoods = $scope.countOfGoods - (($scope.cartListOfGoods.find(i => i.id === id)).countOfOneGood);

                var removeIndex = $scope.cartListOfGoods.map(function (item) {
                    return item.id;
                }).indexOf(id);

                $scope.cartListOfGoods.splice(removeIndex, 1);

                LocalStorageCartData();
                PriceSum();
            }

            $scope.Plus = function (id) {
                $scope.countOfGoods = $scope.countOfGoods + 1;
                ($scope.cartListOfGoods.find(i => i.id === id)).countOfOneGood += 1;

                LocalStorageCartData();
                PriceSum();
            }

            $scope.Minus = function (id) {
                if (($scope.cartListOfGoods.find(i => i.id === id)).countOfOneGood > 1) {
                    $scope.countOfGoods = $scope.countOfGoods - 1;
                    ($scope.cartListOfGoods.find(i => i.id === id)).countOfOneGood -= 1;

                    LocalStorageCartData();
                    PriceSum();
                } else {
                    $scope.deleteFromCart(id);
                }
            }

            $scope.sumOfNumberGoodPrice = function (goodObject) {
                console.log(parseFloat(goodObject.price) * parseInt(goodObject.countOfOneGood));
                return parseFloat(goodObject.price) * parseInt(goodObject.countOfOneGood);
            }

            function PriceSum() {
                $scope.SumOfGoodsPrice = 0;
                for (var i = 0; i < $scope.cartListOfGoods.length; i++) {
                    $scope.SumOfGoodsPrice += ($scope.cartListOfGoods[i].price * $scope.cartListOfGoods[i].countOfOneGood);
                }

                //  prints if Cart Is Empty
                if ($scope.cartListOfGoods.length <= 0) {
                    $scope.statusCartTable = false;
                    $scope.statusCartEmpty = true;
                } else {
                    $scope.statusCartTable = true;
                    $scope.statusCartEmpty = false;
                }
            }

            function LocalStorageCartData() {
                localStorage.cartList = JSON.stringify($scope.cartListOfGoods);
                localStorage.countOfGoods = parseInt($scope.countOfGoods);
            }

        }
    }
});

app.directive("selectedgoodBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/selectedGood.html',
        controller: function ($scope) {
            $scope.listOfCommetsForSelectedGood = [];
            $scope.SaveNewComment = function () {
                if ($("#nameForSelectedGoodForNewCommentInputId").val() == "" || $("#contentForSelectedGoodForNewCommentInputId").val() == "") {
                    RequiredFieldAlert();
                    return;
                }

                $scope.listOfCommetsForSelectedGood.push({
                    name: $("#nameForSelectedGoodForNewCommentInputId").val(),
                    content: $("#contentForSelectedGoodForNewCommentInputId").val(),
                    date: Date.now()
                });

                let obj = {
                    selectedGoodId: $scope.selectedGood.id,
                    comment: {
                        name: $("#nameForSelectedGoodForNewCommentInputId").val(),
                        content: $("#contentForSelectedGoodForNewCommentInputId").val(),
                        date: Date.now()
                    }
                }

                $scope.listOfGoods.find(i => i.id == $scope.selectedGood.id).countOfTheCommets += 1;

                socket.emit("saveCommentOfGoodToDb", obj);
            }

            socket.on("getResSaveCommentOfGoodToDb", function (data) {
                socket.emit("selectedGood", {
                    id: $scope.selectedGood.id
                });
            });

        }
    }
});

app.directive("goodsBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/goods.html',
        controller: function ($scope) {

            //  Visitors of the goods
            let listOfGoodsAttendance = [];
            socket.emit("getAllAttendanceOfTheGoods", {});
            socket.on("getResAllAttendanceOfTheGoods", function (data) {
                listOfGoodsAttendance = data;

                for (let i = 0; i < listOfGoodsAttendance.length; i++) {
                    if ($scope.listOfGoods.some(j => j.id == listOfGoodsAttendance[i].id)) {
                        $scope.listOfGoods.find(j => j.id == listOfGoodsAttendance[i].id).countOfVisitors = $scope.GetGoodsAttendance(listOfGoodsAttendance[i].id);
                    }
                }

                for (let i = 0; i < $scope.listOfGoods.length; i++) {
                    if ($scope.listOfGoods[i].countOfVisitors === undefined) {
                        $scope.listOfGoods[i].countOfVisitors = 0;
                    }

                    $scope.listOfGoods[i].countOfTheCommets = $scope.GetCommentsCount($scope.listOfGoods[i].comments);
                }

                $scope.$digest();
            });

            let maxHeightOfBlock = 0;
            $scope.rowLimit = currentLimit;

            $(document).ready(function () {
                SetGoodsPosition(400);
                SetBlockToCenterByAnimat(600);
                socket.emit("getAllAttendanceOfTheGoods", {});
            });

            setTimeout(() => {
                SetGoodsPosition(400);
                SetBlockToCenterByAnimat(600);
                socket.emit("getAllAttendanceOfTheGoods", {});
            }, 2000);

            $scope.GetMoreGoods = function () {
                let currentCountOfGoods = $scope.rowLimit;
                $scope.rowLimit += countForServer;

                let countOfGoodsObj = {
                    currentCount: currentCountOfGoods,
                    count: countForServer
                };

                socket.emit("getMoreGoods", countOfGoodsObj);
                socket.emit("getAllAttendanceOfTheGoods", {});
            }

            socket.on("getResGetMoreGoods", function (data) {
                for (var i = 0; i < data.length; i++) {
                    //  Need to add only new goods
                    if (!$scope.listOfGoods.some(good => good.id === data[i].id)) {
                        $scope.listOfGoods.push(data[i]);
                    }
                }
                $scope.$digest();
                SetGoodsPosition(600);
                SetBlockToCenterByAnimat(700);
            });

            $scope.changeFindInput = function () {
                maxHeightOfBlock = 0;
                SetGoodsPosition(100);
                SetBlockToCenterByAnimat(500);
            };

            document.getElementsByTagName("BODY")[0].onresize = function () {
                maxHeightOfBlock = 0;
                SetGoodsPosition(300);
                SetBlockToCenterByAnimat(500);
            };

            function SetGoodsPosition(ms) {
                setTimeout(() => {
                    let x = 0,
                        y = 0,
                        jj = 0,
                        goodblockWidth = 200,
                        marginForGoodBlock = 20;

                    let isSecondRow = false;
                    let arr = [];
                    let blockWidth = 0;
                    for (var j = 0; j < $(".good__block").length; j++) {
                        if (x > $(".main___good__block").width() - goodblockWidth) {
                            x = 0;
                            isSecondRow = true;
                        }

                        arr.push({
                            left: 0,
                            top: 0,
                            height: 0
                        });

                        if (isSecondRow) {
                            y = arr[jj].height + marginForGoodBlock + arr[jj].top;
                            jj++;
                        }

                        arr[j].left = x;
                        arr[j].top = y;
                        arr[j].height = $(".good__block").eq(j).height();

                        x += (goodblockWidth + marginForGoodBlock);

                        if (!isSecondRow) {
                            blockWidth += (goodblockWidth + marginForGoodBlock);
                        }
                    }

                    for (var ii = 0; ii < arr.length; ii++) {
                        $(".good__block").eq(ii).animate({
                            left: arr[ii].left + "px",
                            top: arr[ii].top + "px",
                            opacity: "1"
                        }, 700);

                        if (maxHeightOfBlock < (arr[ii].top + arr[ii].height + marginForGoodBlock)) {
                            maxHeightOfBlock = arr[ii].top + arr[ii].height + marginForGoodBlock;

                            $("#goodsBlockElement").css({
                                height: (maxHeightOfBlock) + "px"
                            });

                            $(".main___good____content").css({
                                height: (maxHeightOfBlock) + "px"
                            });
                        }

                        $(".main___good____content").css({
                            width: (blockWidth - 20) + "px"
                        });

                        $("#getMoreGoodsBtn").css({
                            opacity: "1",
                            top: (maxHeightOfBlock) + "px",
                        });

                    }
                }, ms)
            };

            function SetBlockToCenterByAnimat(ms) {
                setTimeout(() => {
                    let leftMargin = ($(".main___good__block").width() - $(".main___good____content").width()) / 2;
                    $(".main___good____content").animate({
                        left: leftMargin + "px"
                    });
                }, ms);
            }

            //  select category
            $scope.category = '';
            $scope.categoryList = function (value) {
                $scope.category = value;

                maxHeightOfBlock = 0;
                SetGoodsPosition(200);
                SetBlockToCenterByAnimat(700);
            }

            $scope.SortBy = function (property) {
                $scope.goodProperty = property;
                $scope.reverse = false;

                maxHeightOfBlock = 0;
                SetGoodsPosition(200);
                SetBlockToCenterByAnimat(1000);
            }

            $scope.SortByReverse = function (property) {
                $scope.goodProperty = property;
                $scope.reverse = true;

                maxHeightOfBlock = 0;
                SetGoodsPosition(200);
                SetBlockToCenterByAnimat(1000);
            }

            let currentStatus = 0;
            $scope.HideCategoryMenu = function () {
                if (currentStatus === 0) {
                    $(".main___good__block").css({
                        justifyContent: 'flex-start'
                    });
                    $("#menuCategoryFilterElement").animate({
                        left: '-100%'
                    });
                    $("#goodsBlockElement").animate({
                        width: '98%'
                    });
                    currentStatus = 1;

                    maxHeightOfBlock = 0;
                    SetGoodsPosition(600);
                    SetBlockToCenterByAnimat(700);
                } else if (currentStatus === 1) {
                    $("#goodsBlockElement").animate({
                        width: '75%'
                    });
                    $("#menuCategoryFilterElement").animate({
                        left: '0'
                    });
                    currentStatus = 0;

                    maxHeightOfBlock = 0;
                    SetGoodsPosition(600);
                    SetBlockToCenterByAnimat(700);
                }
            }

            $scope.allItems = true;
            $scope.singleItem = false;

            $scope.ChooseSelectedGood = function (id) {
                $scope.allItems = false;
                $scope.singleItem = true;

                socket.emit("selectedGood", {
                    id: id
                });

                socket.emit("increaseAttendanceOfTheSelectedGood", {
                    id: id
                });
            }

            socket.on("getResSelectedGood", function (data) {
                if (data.comments != "") {
                    if ((typeof data.comments) == "string") {
                        data.comments = JSON.parse(data.comments);
                    } else {
                        data.comments = data.comments;
                    }
                } else {
                    data.comments = [];
                }

                $scope.selectedGood = data;
                $scope.$digest();
            });

            $scope.BackToAllGoods = () => {
                $scope.allItems = true;
                $scope.singleItem = false;

                SetGoodsPosition(600);
                SetBlockToCenterByAnimat(700);
            };

            $scope.GetCommentsCount = function (comments) {
                let listOfCommets = [];

                if ((typeof comments) == 'string') {
                    if (comments == '') {
                        return 0;
                    }
                    listOfCommets = JSON.parse(comments);
                }

                return listOfCommets.length;
            }

            $scope.GetGoodsAttendance = function (id) {
                if (listOfGoodsAttendance.some(i => i.id == id)) {
                    return (listOfGoodsAttendance.find(i => i.id == id)).countOfVisitors;
                }
                return 0;
            }

            socket.on("getResIncreaseAttendanceOfTheSelectedGood", function (data) {
                $scope.listOfGoods.find(i => i.id == data.id).countOfVisitors = data.countOfVisitors;
                $scope.$digest();
            });

        }
    }
});

app.filter('unique', function () {
    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {},
                newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

//  File Upload config
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive("adminBlock", function () {
    return {
        replace: true,
        templateUrl: "template/admin.html",
        controller: function ($scope, $http) {
            socket.emit("goods");
            socket.on("getResGoods", function (data) {
                $scope.listOfGoods = data;
                $scope.$digest();
            });

            //  getting list of orders from db 
            socket.emit("orders");
            socket.on("getResOrders", function (data) {
                $scope.listOfOrders = data;
            });

            socket.emit("messages");
            socket.on("resGetMessages", function (data) {
                $scope.listOfContactMessages = data;
            });

            $scope.selectedOrderStatus = false;
            $scope.GetGoodsByOrder = function (order) {
                $scope.selectedOrderStatus = true;

                $scope.orderClientFirstName = order.firstName;
                $scope.orderClientSecondName = order.secondName;
                $scope.orderClientPhone = order.phone;
                $scope.orderClientEmail = order.email;
                $scope.orderClientCity = order.address;
                $scope.orderClientAdditionalInformation = order.additionalInformation;

                let obj = {
                    order: JSON.parse(order.orderGoodsCount)
                }

                socket.emit("selectGoodsByOrder", obj);
            }

            socket.on("resGetGoodsByOrder", function (data) {
                $scope.array = data;
                $scope.$digest();
            });


            $scope.createNewGoodStatus = false;
            $scope.OpenRowCreateNewGood = function () {
                $scope.createNewGoodStatus = true;
            }

            $scope.CanselNewGood = function () {
                $scope.createNewGoodStatus = false;
            }

            $scope.CreateNewGood = function () {
                var imgNumberName = 0;
                if ($scope.listOfGoods[0] == undefined) {
                    imgNumberName = 1;
                } else {
                    imgNumberName = $scope.listOfGoods[$scope.listOfGoods.length - 1].id + 1;
                };

                var fd = new FormData();
                fd.append(imgNumberName, $("#fileUpLoad")[0].files[0]);

                $http.post('http://localhost:8000/multer', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });

                let newGoodObject = {
                    name: $("#nameOfNewGood").val(),
                    price: $("#priceOfNewGood").val(),
                    category: $("#categoryOfNewGood").val(),
                    src: imgNumberName,
                    new_good: statusNewOfGood.checked.toString(),
                    save_money: statusSaveMoneyOfGood.checked.toString(),
                    old_price: $("#newOldPriceOfNewGood").val(),
                    top_good: statusTopOfGood.checked.toString()
                };

                socket.emit("addNewGood", newGoodObject);
                socket.emit("goods");

                $scope.createNewGoodStatus = false;
            }

            socket.on("getResAddNewGood", function (data) {
                console.log(data);
            });

            $scope.RemoveObject = function (id) {
                if (confirm("Are you sure?")) {
                    socket.emit("deleteGood", {
                        id: id
                    });
                    socket.emit("goods");
                }
            }

            socket.on("getResDeleteGood", function (data) {
                console.log(data);
            });



            $scope.selectedGoodForChange = {};
            $scope.changeGoodStatus = false;
            $scope.ChangeObject = function (id) {
                $scope.changeGoodStatus = true;

                socket.emit("selectedGoodForAdmin", {
                    id: id
                });
            }

            socket.on("getResSelectedGoodForAdmin", function (data) {
                $scope.idOfSelectedGood = data.id;
                $scope.imgSrc = data.src;
                $("#changeNameOfGood").val(data.name);
                $("#changePriceOfGood").val(data.price);
                $("#changeCategoryOfGood").val(data.category);
                $("#changeOldPriceOfNewGood").val(data.old_price);

                if ("true" == data.new_good) {
                    changeStatusNewOfGood.checked = true;
                } else {
                    changeStatusNewOfGood.checked = false;
                }

                if ("true" == data.save_money) {
                    statusSaveMoneyOfGood.checked = true;
                } else {
                    statusSaveMoneyOfGood.checked = false;
                }
                
                if ("true" == data.top_good) {
                    changeStatusTopOfGood.checked = true;
                } else {
                    changeStatusTopOfGood.checked = false;
                }
                
                $scope.$digest();
            });

            //  if need change Img
            $scope.statusImgUpload = false
            $scope.changeSatusImgUpload = function () {
                if (!$scope.statusImgUpload) {
                    $scope.statusImgUpload = true;
                } else {
                    $scope.statusImgUpload = false;
                }
            }

            $scope.SaveChanges = function (id) {
                if ($scope.statusImgUpload == true && $("#changeFileUpLoad")[0].files[0] !== undefined) {
                    var fd = new FormData();

                    fd.append(($scope.imgSrc += "-1"), $("#changeFileUpLoad")[0].files[0]);
                    $http.post('http://localhost:8000/multer', fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    });
                }

                var changedObject = {
                    id: $scope.idOfSelectedGood,
                    name: $("#changeNameOfGood").val(),
                    price: $("#changePriceOfGood").val(),
                    category: $("#changeCategoryOfGood").val(),
                    src: $scope.imgSrc,
                    new_good: changeStatusNewOfGood.checked,
                    save_money: statusSaveMoneyOfGood.checked.toString(),
                    old_price: $("#changeOldPriceOfNewGood").val(),
                    top_good: changeStatusTopOfGood.checked.toString()
                }

                socket.emit("changeGood", changedObject);

                $scope.changeGoodStatus = false;
            }

            socket.on("getResChangeGood", function (data) {
                console.log(data);
                socket.emit("goods");
            });

            $scope.CancelGoodChanges = function () {
                $scope.changeGoodStatus = false;
            }

            $scope.CalcGoodSum = function (price, count) {
                return parseFloat(price) * parseInt(count);
            }

            $scope.CalcAllGoodsSum = function () {
                if ($scope.array !== undefined) {
                    let number = 0;
                    for (var i = 0; i < $scope.array.length; i++) {
                        number += (parseFloat($scope.array[i].price) * parseInt($scope.array[i].orderGoodsCount));
                    }
                    return number;
                }
            }

        }
    }
});

app.directive("footerBlock", function () {
    return {
        replace: true,
        templateUrl: "/template/footer.html",
        controller: function ($scope) {
            $scope.CurrentData = function () {
                return "2017 - " + (new Date()).getFullYear();
            }

            let isFooterOpen = true;
            $scope.hideFooterBtn = () => {
                if (isFooterOpen === true) {
                    $(".footer").animate({
                        height: "0px"
                    }, 600);
                    $("#hideFooterBtn").val("Open footer");
                    isFooterOpen = false;
                } else {
                    $(".footer").animate({
                        height: "47px"
                    }, 600);
                    $("#hideFooterBtn").val("Hide footer");
                    isFooterOpen = true;
                }
            }
        }

    }
});

app.directive("contactusBlock", function () {
    return {
        replace: true,
        templateUrl: "/template/contactUs.html",
        controller: function ($scope) {
            $scope.SendMessage = function () {
                let sendMesObj = {
                    name: (document.getElementById("contactInputName")).value,
                    email: (document.getElementById("contactInputEmail")).value,
                    phone: (document.getElementById("contactInputPhone")).value,
                    message: (document.getElementById("contactInputMessage")).value
                }

                socket.emit("sendMessage", sendMesObj);
            }

            socket.on("getResSendMessage", function (data) {
                console.log(data);
                RequiredFieldAlert(data);

                (document.getElementById("contactInputName")).value = "";
                (document.getElementById("contactInputEmail")).value = "";
                (document.getElementById("contactInputPhone")).value = "";
                (document.getElementById("contactInputMessage")).value = "";
            })

        }
    }
});

app.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }

    }
}]);

app.directive('modalBlock', function () {
    return {
        replace: true,
        templateUrl: "/template/modalWindows.html"
    }
});
