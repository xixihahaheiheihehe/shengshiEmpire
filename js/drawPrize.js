			$(function() {
				mui.plusReady(function() {
					initData();
				});
				var resultData,totalScore;
				var $btn = $('.playbtn');
				var isture = 0;
				var clickfunc = function(data) {
					switch(data) {
						case 0:
							rotateFunc(1, 0, '谢谢参与');
							break;
						case 1:
							rotateFunc(2, 90, '一等奖');
							break;
						case 2:
							rotateFunc(3, 180, '二等奖');
							break;
						case 3:
							rotateFunc(4, 270, '三等奖');
							break;
					}
				};
				$('.playbtn').on('tap', function() {
					drawPrize();
				})

				var rotateFunc = function(awards, angle, text) {
					isture = true;
					$btn.stopRotate();
					$btn.rotate({
						angle: 0,
						duration: 4000, //旋转时间
						animateTo: angle + 1440, //让它根据得出来的结果加上1440度旋转
						callback: function() {
							isture = false; // 标志为 执行完毕
							if(text == "谢谢参与") {
								mui.alert("再接再厉! 祝君中奖", "谢谢参与", ["确定"], function(e) {

								}, 'div');
							} else {
								mui.alert('<div class="popup-tip-title">' + "66666" + '</div> <div class="popup-tip-text">恭喜您抽中' + text + "666RC" + ',已发放到你的资金账户，可在兑换中查看。</div>', text, ["确定"], function(e) {

								}, 'div');
							}

						}
					});
				};
				mui('.mui-scroll-wrapper').scroll({
					indicators: true //是否显示滚动条
				});

				$('.lottery-rule').on('tap', function() {
					$("#rule-pop").css("display", "block")
					$("#rule-pop-backdrop").css("display", "block")
				});
				$('.lottery-name').on('tap', function() {
					var params = {};
					params.from = itemUrl.mfrom;
					params.sign = itemUrl.sign;
					params.token = getToken();
					params.fid = resultData.id;
					mui.post(baseUrl + itemUrl.prizemember, params, function(data) {
						if(data.code == "200") {
					    $("#prize-list-pop").css("display", "block")
					    $("#rule-pop-backdrop").css("display", "block");
						var drawListHtml = template.render('draw-list', data.data);
					      $(".draw-name-list").append(drawListHtml);
						}else{
							mui.toast(data.message, {
							duration: 'long',
							type: 'div'
						   });
						}
					}, 'json');
				});

				function initData() {
					$.ajax({
						url: baseUrl + itemUrl.itemList,
						type: 'post',
						dataType: 'json',
						data: {
							token: getToken,
							from: itemUrl.mfrom,
							sign: itemUrl.sign,
							catalog: 3,
							page: 1
						},
						success: function(result) {
							if(result.code == 200) {
								console.log(JSON.stringify(result.data));
								resultData = result.data.list[0];
								totalScore = result.data.score;
								$(".totalRC").html(result.data.totalRC);
								$(".rule-text").html(result.data.rule);
								$(".canUse-score").text("可用" + totalScore);
								refreshPage();
								initEvent();

							}
						},
						error: function(xhr, type, errorThrown) {
							alert(JSON.stringify(errorThrown));
						}
					});
				}

				function refreshPage() {
					$(".item-score").text(resultData.current);
					$(".item-title").text(resultData.title);
					$(".turnTable-schedule").text(resultData.title);
					$(".have-plan").text("已筹" + resultData.current);
					$(".need-plan").text("/需筹" + resultData.target + ",进度:" + resultData.progress + "%");
					$(".drawName-list").text(resultData.title+"中奖名单");

					$(".circleChart").circleChart({
						value: resultData.progress,
						size:  260,
						startAngle:  180,
						speed: 3000,
						widthRatio: .1,
						color:   "#9E2B31",
						backgroundColor:   "#C0A16B",
						animation: "easeInOutCubic"
					});
				}

				function initEvent() {
					$(".have-konw").on("tap", function() {
						$("#rule-pop").css("display", "none")
						$("#rule-pop-backdrop").css("display", "none")
					})

					mui('.turnTable-body').on('tap', '.turnTable-schedule', function() {
						$("#grab-ticket").css("display", "block")
						$("#grab-ticket-backdrop").css("display", "block");

					});
					$(".book-cancle").on('tap', function() {
						$("#grab-ticket").css("display", "none")
						$("#grab-ticket-backdrop").css("display", "none")
					});
					$(".book-sure").on('tap', function() {
						if($("#invest-money").val() == "") {
							alert("请输入投注数量");
							return;
						}
						if($("#trade-password").val() == "") {
							alert("请输入交易密码");
							return;
						}
						invest();
					});

					$(".close-pop").on('tap', function() {
						$(".mui-popup").css("display", "none")
						$("#rule-pop-backdrop").css("display", "none")
					});
				}

				function getSubStr(str) {
					var subStr1 = str.substr(0, 5);
					var subStr2 = str.substr(str.length - 5, 5);
					var subStr = subStr1 + "..." + subStr2;
					return subStr;
				};

				//投注
				function invest() {
					plus.nativeUI.showWaiting("");
					$.ajax({
						url: baseUrl + itemUrl.invest,
						type: 'post',
						dataType: 'json',
						data: {
							token: getToken,
							from: itemUrl.mfrom,
							sign: itemUrl.sign,
							fid: resultData.id,
							safeword: $("#trade-password").val(),
							money: $("#invest-money").val(),
						},
						success: function(result) {
							plus.nativeUI.closeWaiting();
							if(result.code == 200) {
								$("#grab-ticket").css("display", "none");
								$("#grab-ticket-backdrop").css("display", "none");
								alert("恭喜您，投注成功");
							}
						},
						error: function(xhr, type, errorThrown) {
							plus.nativeUI.closeWaiting();
							plus.nativeUI.toast(JSON.stringify(errorThrown));
						}
					});
				}

				//抽奖
				function drawPrize() {
					$.ajax({
						url: baseUrl + itemUrl.prize,
						type: 'post',
						dataType: 'json',
						data: {
							token: getToken,
							from: itemUrl.mfrom,
							sign: itemUrl.sign,
							fid: resultData.id,
						},
						success: function(result) {
							console.log(JSON.stringify(result));
							if(result.code == 200) {
								if(isture) return; // 如果在执行就退出
					             isture = true; // 标志为 在执行
					             clickfunc(result.data.awards);
							}else{
								plus.nativeUI.toast(JSON.stringify("抱歉,"+result.message));
							}
						},
						error: function(xhr, type, errorThrown) {
							plus.nativeUI.toast(JSON.stringify(errorThrown));
						}
					});
				}
			});