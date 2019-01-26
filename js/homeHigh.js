$(function(){
		var invset_id,title,progress,totalRC,dataList;
			mui.plusReady(function(){
				initData();
			});
			function initData(){
					$.ajax({
					url: baseUrl+itemUrl.itemList,
					type: 'post',
					dataType: 'json',
					data: {
						token:getToken,
						from:itemUrl.mfrom,
						sign:itemUrl.sign,
						catalog:2,
						page:1
					},
					success: function(result) {
						if(result.code == 200){
						console.log(JSON.stringify(result.data));
						dataList = result.data.list;
						 totalRC = result.data.totalRC;
						 $(".totalRC").html(result.data.totalRC);
						 $(".rule-text").html(result.data.rule);
						  $(".total-money").text("可用"+result.data.score);
					      var itemHtml = template.render('itemList', result.data);
					      $(".item-list").append(itemHtml);
					      initEvent();
					      dealDetailStatu();
						 }
					},
					error: function(xhr, type, errorThrown) {
						plus.nativeUI.toast(JSON.stringify(errorThrown));
					}
			  });
			}
           			
			
			function initEvent(){
			 	mui('.mui-fullscreen').on('tap', '.rule', function() {
				$("#rule-pop").css("display", "block")
				$("#rule-pop-backdrop").css("display", "block")
			});
			$(".have-konw").on("tap", function() {
				$("#rule-pop").css("display", "none")
				$("#rule-pop-backdrop").css("display", "none")
			})
			
			mui('.item-list').on('tap',".normal-part",function(){
				 invset_id = this.getAttribute("data-id");
				 title = this.getAttribute("data-title");
				 progress = this.getAttribute("data-progress");
					if(progress < 50) {
						$(".touzhu-action").text("预约");
					} else {
						$(".touzhu-action").text("抢票");
					}
				 $(".set-number").text(title);
				
				$("#grab-ticket").css("display", "block");
				$("#grab-ticket-backdrop").css("display", "block");
			})
		
			$(".book-cancle").on('tap',function(){
				$("#grab-ticket").css("display", "none")
				$("#grab-ticket-backdrop").css("display", "none")
			});
			$(".book-sure").on('tap',function(){
                 if($("#invest-money").val() == ""){alert("请输入投注数量");return;}
                 if($("#trade-password").val() == ""){alert("请输入交易密码");return;}
                 invest();
			});	
			
		}
			//投注
			function invest(){
				plus.nativeUI.showWaiting("");
				$.ajax({
					url: baseUrl+itemUrl.invest,
					type: 'post',
					dataType: 'json',
					data: {
						token:getToken,
						from:itemUrl.mfrom,
						sign:itemUrl.sign,
						fid:invset_id,
						safeword:$("#trade-password").val(),
						money:$("#invest-money").val(),
					},
					success: function(result) {
						plus.nativeUI.closeWaiting();
						mui.toast(result.message,{ duration:'long', type:'div' });
						if(result.code == 200){
						$("#grab-ticket").css("display", "none");
				        $("#grab-ticket-backdrop").css("display", "none");
						 // alert("恭喜您，投注成功");
						}
					},
					error: function(xhr, type, errorThrown) {
						plus.nativeUI.closeWaiting();
						alert(JSON.stringify(errorThrown));
					}
			  });
			}
			
			
			function dealDetailStatu() {
				var timestamp = parseInt(new Date().getTime()); //当前时间戳
				//处理投注状态显示
				var normalItem = $(".item-list .normal-part");
				for(i = 0; i < dataList.length; i++) {
					var statusItem = $(normalItem[i]).find(".book");
					var dataSome = dataList[i];
					var appoint = dataList[i].appoint;
					if(dataSome.progress < 50) { //上半场
						if(appoint.is_open1 == 0) { //没有开启抢票
							statusItem.text("待开放");
						} else { //开启抢票
							if(appoint.appoint_at1 == "" && appoint.appoint_at2 == "") {
								statusItem.text("预约");
							} else if(appoint.appoint_at1 != "" && appoint.appoint_at2 != "") {
								if(parseInt(appoint.appoint_at1) <= timestamp <= parseInt(appoint.appoint_at2)) {
									statusItem.text("预约");
								} else {
									statusItem.text("待开放");
								}
							} else if(appoint.appoint_at1 != "") {
								if(parseInt(appoint.appoint_at1) <= timestamp) {
									statusItem.text("预约");
								} else {
									statusItem.text("待开放");
								}
							} else {
								if(timestamp <= parseInt(appoint.appoint_at2)) {
									statusItem.text("预约");
								} else {
									statusItem.text("待开放");
								}
							}
						}

					}else { //下半场
						if(dataSome.progress == 100){
							statusItem.text("已完成");
							statusItem.addClass("finish");
							statusItem.removeClass("book");
						}else{
							if(appoint.is_open_1 == 0) { //没有开启抢票
							statusItem.text("待开放");
						} else { //开启抢票
							if(appoint.appoint_at_1 == "" && appoint.appoint_at_2 == "") {
								statusItem.text("抢票");
							} else if(appoint.appoint_at_1 != "" && appoint.appoint_at_2 != "") {
								if(parseInt(appoint.appoint_at_1) <= timestamp <= parseInt(appoint.appoint_at_2)) {
									statusItem.text("抢票");
								} else {
									statusItem.text("待开放");
								}
							} else if(appoint.appoint_at_1 != "") {
								if(parseInt(appoint.appoint_at_1) <= timestamp) {
									statusItem.text("抢票");
								} else {
									statusItem.text("待开放");
								}
							} else {
								if(timestamp <= parseInt(appoint.appoint_at_2)) {
									statusItem.text("抢票");
								} else {
									statusItem.text("待开放");
								}
							}
						}
						}

					}
				}
			}
	
	
});
