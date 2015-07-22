'use strict';

/**
 * @ngdoc function
 * @name relcyEditorialApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the relcyEditorialApp
 */
angular.module('relcyEditorialApp')
.controller('MainCtrl', function ($scope,StatusService,ngTableParams) {
	$scope.keys = [];
	$scope.pendingRecords = [];
	$scope.approvedRecords = [];
	$scope.rejectedRecords = [];
	$scope.approvedKeys = [];
	$scope.rejectedKeys = [];
	$scope.pendingKeys = [];

		$scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
	        count: 10,          // count per page
	        sorting: {
	            name: 'asc'     // initial sorting
	        }
	    } );

	$scope.getKeys = function()
	{
		$scope.keys = JSON.parse('{   "keys":[      {"key":"a2486cd6e7aab5d8abbc97b8593e8352","status":"APPROVED"},      {"key":"61cf8f74d5ac1a70892ceda23d77dd5a","status":"PENDING"},      {"key":"8f15fa4e4caaf9969b2a946bba44fe25","status":"REJECTED"},      {"key":"328ef09bc74d312f186cb9b912a654af","status":"APPROVED"},      {"key":"e200af1a08a5a105d5336c19d9394055","status":"PENDING"},      {"key":"c8719df7ac95bfa4f06837123fe21355","status":"REJECTED"},      {"key":"fa97adfd363ac7b15b71a43fc36ccf31","status":"REJECTED"},      {"key":"5e1d62fa4c6db13c13904bd66e38ab88","status":"PENDING"},      {"key":"1093d0f721f8a13edeca4f1bbcd8a3b1","status":"APPROVED"},      {"key":"ad9bfa2d748674acc9e0194b264535fb","status":"APPROVED"},      {"key":"05437cc771195b080fe1a492bf3191dc","status":"PENDING"},      {"key":"964fc2ebe97570fa289784f8334bb494","status":"REJECTED"},      {"key":"2649a552d36710333a215eeb604cb57e","status":"APPROVED"},      {"key":"84e173f78f796bc6104b1d116842a623","status":"PENDING"},      {"key":"d28de1c0294ba7423a8e7bd01e80422a","status":"APPROVED"},      {"key":"a514abace695c596739c3ea141014a8b","status":"REJECTED"},      {"key":"62f8c3593eea0a2a3e2d2c203293f76c","status":"PENDING"},      {"key":"cd1b8abc193410c33f0d65d3a89b09f4","status":"APPROVED"},      {"key":"b3a906828c2d8e22977cd8dc7563681b","status":"APPROVED"},      {"key":"f5eec1560c4cfb8b1f4e9cb0215ce6c5","status":"PENDING"},      {"key":"86c21742b6b05ec6d4c26c5e14541717","status":"REJECTED"},      {"key":"fe7967f5218885513fe41f91b2506139","status":"APPROVED"},      {"key":"bf7911e6f7b00794b3a497189f6f4e21","status":"PENDING"},      {"key":"4386c7d1f454b695c9a87b7d7526f77c","status":"APPROVED"},      {"key":"bdec383e7ccf26738272c72ddd03f531","status":"REJECTED"},      {"key":"62f2bfa39c0d8f71d73b9b01b2c1912c","status":"PENDING"},      {"key":"e95e97439919b9d8c97543e9f4f168df","status":"APPROVED"},      {"key":"a2d4e3d628b3a2eb50d0179ec3c76372","status":"APPROVED"},      {"key":"976627915595a04f0417ed264df449cf","status":"PENDING"},      {"key":"a0076a07b5891ca55cf6806e5068d1ff","status":"REJECTED"},      {"key":"6aa4a48cca538984b08dc8b8bee5199b","status":"APPROVED"},      {"key":"f68fc9a4279f8305ceee429285ef8971","status":"PENDING"},      {"key":"e1bd9c59765e7c7849e9e7c940cfea53","status":"APPROVED"},      {"key":"7774c7ec1f78b560bdd48cbd6273ae6d","status":"REJECTED"},      {"key":"271a7e474f3e9753b9e203196b594fac","status":"PENDING"},      {"key":"022fe976cf8ff74bd4e704a12494c2ab","status":"APPROVED"},      {"key":"505623f1e9d6ea2b8754b90fea652a15","status":"APPROVED"},      {"key":"31bf5ab985445d05ce5c08eded6b07c5","status":"PENDING"},      {"key":"15b7db02ffdcfc56dad912b1d33df5e7","status":"REJECTED"},      {"key":"5a5a4fbc7e1076bfb3ee7038883f4d44","status":"APPROVED"},      {"key":"9c7016a5709278a909155eaccc766811","status":"PENDING"},      {"key":"4117dccdcd93f8f0a185a76225960f48","status":"APPROVED"},      {"key":"9c761e7439cd23b6bc49889cbc065d8a","status":"REJECTED"},      {"key":"0206746560f4596e048ed7259c3586bf","status":"PENDING"},      {"key":"f7add6846aee2d593ceff0519357098f","status":"APPROVED"},      {"key":"3fc3deaaf7082170555d11882110c431","status":"APPROVED"},      {"key":"abd5b9c1afda21469dc37befa6a694d6","status":"PENDING"},      {"key":"0d90dd0fc2fe86b856530850c454c3fd","status":"REJECTED"},      {"key":"19635664a87b3959631161f15c894351","status":"APPROVED"},      {"key":"c1b3898f78b9a7d88d4f091590b78c17","status":"PENDING"},      {"key":"f629311daa9374aa90fb9b37cef03281","status":"APPROVED"},      {"key":"83d14d81969b2848f70f1a57fc1f2233","status":"REJECTED"},      {"key":"e37699f7b93fa1eb29b721e9102f33c3","status":"PENDING"},      {"key":"046798f11ec7f0890402200c7fa8430d","status":"APPROVED"},      {"key":"0bfb4298eee4df7f45ead057b52b46a1","status":"APPROVED"},      {"key":"9330420b269848fef633355b384ef42c","status":"PENDING"},      {"key":"d31f564df03cfd387119633c308ddf96","status":"REJECTED"},      {"key":"341aea1195cae95eb35112ae4dec405e","status":"APPROVED"},      {"key":"ddaa06bfe708e7b390865572b4a0929f","status":"PENDING"},      {"key":"92259f76c50f5f97cf14300cc8bf5ec0","status":"APPROVED"},      {"key":"f5f6c08941ed64249e9cb762b9efbba4","status":"REJECTED"},      {"key":"3ad8af0810623ef7fc737044d3ff5351","status":"PENDING"},      {"key":"3b9666fd1b401e4971c0896ec0c7aa26","status":"APPROVED"},      {"key":"e2ac9cdae91899796db47936adf482a6","status":"APPROVED"},      {"key":"3a16d02af3a812c9fa1ba1e2395decac","status":"PENDING"},      {"key":"b32ff2e7e444ee57c9f373ac90037658","status":"REJECTED"},      {"key":"d64bb83dcf8fa5d0d14bbba852dd6ace","status":"APPROVED"},      {"key":"69c04354e3b7bf82e605f6bb1823d821","status":"PENDING"},      {"key":"f2d0f67b9f532a2f5b651bc05a1420f8","status":"REJECTED"},      {"key":"2179ea9b133e84e87900854e5a2bc266","status":"APPROVED"},      {"key":"4a8ca5a1d5e5db387a19a61eaccde557","status":"PENDING"},      {"key":"68fcc43eed523c505a1f5afb189c13ab","status":"REJECTED"},      {"key":"dbb76ac8f07d2afeb2952eb1327b1c9d","status":"APPROVED"},      {"key":"bfc4211237b4e0e3d0a92d6b6fd43476","status":"REJECTED"},      {"key":"bc944407afba7a0dc6be09b36bfb5b56","status":"PENDING"},      {"key":"e5c5042ec874bdda287f9320bb3d7383","status":"APPROVED"},      {"key":"580ba96cbf550e4502a8bece36bfb353","status":"APPROVED"},      {"key":"f3f410a85978e461c44adcb3bb7a9091","status":"PENDING"},      {"key":"db5d6e608c321f1d59c718e23b22f02a","status":"REJECTED"},      {"key":"1d5b448c21d97016f3a3737e976a51b5","status":"APPROVED"},      {"key":"4967657c10d8056ba5f6464d88b17940","status":"PENDING"},      {"key":"b6606d677a5671b1170d3294b301210b","status":"APPROVED"},      {"key":"cd88a6a13e04c8280bc80ba2689380cd","status":"REJECTED"},      {"key":"0d2dfe6d766d3bbd1a2531facd993f6b","status":"PENDING"},      {"key":"8af88c8162b3eeb67a66879bba1e796c","status":"APPROVED"},      {"key":"af8ee50e2f3f2a3d3eaca55c1f24e4cf","status":"APPROVED"},      {"key":"26403d85a67a9062719f04b16c997ad8","status":"PENDING"},      {"key":"c5b4a12cd05e5682752f086ac3c7eef5","status":"REJECTED"},      {"key":"bc6f48dd199311d8e1f02c1d4f1f8a50","status":"APPROVED"},      {"key":"2652324b2a866991367decb89a2a3e70","status":"PENDING"},      {"key":"1d44c308ad9ead8f1c2b8bce05dd76b9","status":"APPROVED"},      {"key":"7e09f395a05ec0292d8aa61971f99dcb","status":"REJECTED"},      {"key":"3bd920f810f13a08148ed23d12025834","status":"PENDING"},      {"key":"a91a7ccc2fb1324a3729ad949182636e","status":"APPROVED"},      {"key":"03bf75e72f995c57dd5f56478f00a6ed","status":"APPROVED"},      {"key":"c03283d8d1daff8db3c89763a7aefe98","status":"PENDING"},      {"key":"d1663a6aecdefcd44f83c63fc751ad95","status":"REJECTED"},      {"key":"1d44eee5480bf0db20972fdb2ebc6d7b","status":"APPROVED"},      {"key":"9945a0dffe3b33bc83c5681e5be8d5c7","status":"PENDING"},      {"key":"bf87f0a5c66d1d8ea06a1b2f93a012e8","status":"APPROVED"},      {"key":"f71b6c973053095f4d7e2a820c22a605","status":"REJECTED"},      {"key":"d3ef1a8b9bc5f133dadd5c418aab03fc","status":"PENDING"},      {"key":"25860d34eb284aa5f33dd885c076f89d","status":"APPROVED"},      {"key":"eb440a980549d2b06533092f7c358414","status":"REJECTED"},      {"key":"3545d92d68a786615e86e99edb7c89e0","status":"PENDING"},      {"key":"4c919248909d76c17f80e86917eb1f8f","status":"REJECTED"},      {"key":"024273004d7e3dd40d6f26927546842f","status":"APPROVED"},      {"key":"5558764a09f28dc99274585d16d2c21f","status":"PENDING"},      {"key":"aa7ac0d7b70042e6785b75d04758fb1e","status":"REJECTED"},      {"key":"dbe85a0ce0b710378a0cfde580dca4ce","status":"APPROVED"},      {"key":"2d94c6010bddc62b74223d3e9fb421c6","status":"PENDING"},      {"key":"1df83f764982956f1e6e47c23c99abd5","status":"REJECTED"},      {"key":"120b071b0303e9ac1385d1402463c003","status":"APPROVED"},      {"key":"a7aa65eddd38a22c4ef4117f227b49de","status":"APPROVED"},      {"key":"6e308c7a0e65d700790bba9546c17994","status":"PENDING"},      {"key":"53dd381afedc6b00e68fb20182d9b385","status":"REJECTED"},      {"key":"fbd9b86ae58136320d57307ef0ad1cae","status":"APPROVED"},      {"key":"31e451cebfbee6d5c5dab3f2f38d648a","status":"PENDING"},      {"key":"e61761ebc0ebdfca54a04ca4021b02b8","status":"APPROVED"},      {"key":"c5fd6fbe4d077227961bbd89e2511bf8","status":"REJECTED"},      {"key":"aca088c2dfc5501ba959eb92a823d7f2","status":"PENDING"}   ]}');
		 
		angular.forEach($scope.keys.keys,function(item){ 
			//console.log(item.status)
			if(item.status == "APPROVED")
			{
				$scope.approvedKeys.push(item)
			}
			else if(item.status == "REJECTED")
			{
				$scope.rejectedKeys.push(item)
			}
			else
			{
				$scope.pendingKeys.push(item)
			} 
		}); 

		for (var i = 0; i < 10; i++) {
			addApproveRecords($scope.approvedKeys[i]);
			addRejectedRecords($scope.rejectedKeys[i]);
			addPendingRecords($scope.pendingKeys[i]);
		};



		// StatusService.getAllKeys(function(response){
		// 	console.log(response);
		// 	$scope.keys = response.keys;
		// 	addRecords($scope.keys[0],0);
		// },function(error){
		// 	console.log(error);
		// });
	}
	//
	// $scope.getRecordByKeys = function(key)
	// {
	// 	StatusService.getRecordByKeys({key:key},function(response){
	// 		console.log(response);
	// 		$scope.records = response;
	// 	},function(error){
	// 		console.log(error)
	// 	});
	// }
	//
	$scope.rejectRequest = function(key,type)
	{
		StatusService.rejectRequest({key:key},function(response){
			//console.log(response); 
			if(response.hmset[0] == true)
			{
				if (type=='approve') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.approvedRecords, function(num){ return num.user.invite_id == key });
					$scope.approvedRecords = _.without($scope.approvedRecords,tmpRecord);
					$scope.rejectedRecords.push(tmpRecord)
				}
				if (type=='pending') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.pendingRecords, function(num){ return num.user.invite_id == key });
					$scope.pendingRecords = _.without($scope.pendingRecords,tmpRecord);
					$scope.rejectedRecords.push(tmpRecord)
				}
			}
		},function(error){
			console.log(error)
		});
	}
	//
	$scope.approveRequest = function(key)
	{
		StatusService.approveRequest({key:key},function(response){
			console.log(response);
			if(response.hmset[0] == true)
			{
				if (type=='reject') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.rejectedRecords, function(num){ return num.user.invite_id == key });
					$scope.rejectedRecords = _.without($scope.rejectedRecords,tmpRecord);
					$scope.approvedRecords.push(tmpRecord)
				}
				if (type=='pending') // called from approved section to reject user request
				{
					var tmpRecord = _.find($scope.pendingRecords, function(num){ return num.user.invite_id == key });
					$scope.pendingRecords = _.without($scope.pendingRecords,tmpRecord);
					$scope.approvedRecords.push(tmpRecord)
				}
			}
		},function(error){
			console.log(error)
		});
	}
	//
	function addApproveRecords(key,index)
	{
		var tmpJson = '{   "hgetall":{      "smsid":"SM45e5dd0dc1f5470fb8d96283de9c9a1e",      "time":"2015-06-21T14:41:54.239-07:00",      "status":"APPROVED",      "user":{"name": "Manju","email_address": "leomanjucs@gmail.com","invite_id": "62f8c3593eea0a2a3e2d2c203293f76c","client_id": "1a133c4635","phone_number": "4086060562","ambassador_id": "","device": [{"device_uid": "ADC162B8-2778-4B43-A007-2C6B95421D78","platform": "IOS","modelName": "iPhone","language": "en","timezone": "America/Los_Angeles","version_number": "8.3","advertising_uid": "A2DCA463-9CA9-4D2A-AAE2-CF6D0978E2EC","app_version": "0.9.38","phone_country_code": "310","bundle_id": "com.relcy-labs.Relcy","screenWidth": 375,"screenHeight": 667,"screenScale": 2.0,"timestamp_utc": 1434948093583}]}   }}';
		var response = JSON.parse(tmpJson);
		response.hgetall.user = response.hgetall.user
		response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")   
		try{
			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
			if(thirdParty.third_party_service=='FACEBOOK'){
				response.hgetall.hasFBUrl = true;
				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
			}
		}catch(err){
			response.hgetall.hasFBUrl = false;
		}
		$scope.approvedRecords.push(response.hgetall); 
		
		// StatusService.getRecordByKeys({key:key},function(response){
		// 	console.log(response);
		// 	response.hgetall.user = JSON.parse(response.hgetall.user)
		// 	response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")   
		// 		try{
		// 			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
		// 			if(thirdParty.third_party_service=='FACEBOOK'){
		// 				response.hgetall.hasFBUrl = true;
		// 				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
		// 			}
		// 		}catch(err){
		// 			response.hgetall.hasFBUrl = false;
		// 		}
		// 		$scope.approvedRecords.push(response.hgetall); 
		// },function(error){
		// 	console.log(error)
		// });
	}

	function addPendingRecords(key,index)
	{
		var tmpJson = '{   "hgetall":{      "smsid":"SM45e5dd0dc1f5470fb8d96283de9c9a1e",      "time":"2015-06-21T14:41:54.239-07:00",      "status":"APPROVED",      "user":{"name": "Manju","email_address": "leomanjucs@gmail.com","invite_id": "62f8c3593eea0a2a3e2d2c203293f76c","client_id": "1a133c4635","phone_number": "4086060562","ambassador_id": "","device": [{"device_uid": "ADC162B8-2778-4B43-A007-2C6B95421D78","platform": "IOS","modelName": "iPhone","language": "en","timezone": "America/Los_Angeles","version_number": "8.3","advertising_uid": "A2DCA463-9CA9-4D2A-AAE2-CF6D0978E2EC","app_version": "0.9.38","phone_country_code": "310","bundle_id": "com.relcy-labs.Relcy","screenWidth": 375,"screenHeight": 667,"screenScale": 2.0,"timestamp_utc": 1434948093583}]}   }}';
		var response = JSON.parse(tmpJson);
		response.hgetall.user = response.hgetall.user
		response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")   
		try{
			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
			if(thirdParty.third_party_service=='FACEBOOK'){
				response.hgetall.hasFBUrl = true;
				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
			}
		}catch(err){
			response.hgetall.hasFBUrl = false;
		}
		$scope.pendingRecords.push(response.hgetall); 
		
		// StatusService.getRecordByKeys({key:key},function(response){
		// 	console.log(response);
		// 	response.hgetall.user = JSON.parse(response.hgetall.user)
		// 	response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")   
		// 		try{
		// 			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
		// 			if(thirdParty.third_party_service=='FACEBOOK'){
		// 				response.hgetall.hasFBUrl = true;
		// 				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
		// 			}
		// 		}catch(err){
		// 			response.hgetall.hasFBUrl = false;
		// 		}
		// 		$scope.approvedRecords.push(response.hgetall); 
		// },function(error){
		// 	console.log(error)
		// });
	}
	function addRejectedRecords(key,index)
	{
		var tmpJson = '{   "hgetall":{      "smsid":"SM45e5dd0dc1f5470fb8d96283de9c9a1e",      "time":"2015-06-21T14:41:54.239-07:00",      "status":"APPROVED",      "user":{"name": "Manju","email_address": "leomanjucs@gmail.com","invite_id": "62f8c3593eea0a2a3e2d2c203293f76c","client_id": "1a133c4635","phone_number": "4086060562","ambassador_id": "","device": [{"device_uid": "ADC162B8-2778-4B43-A007-2C6B95421D78","platform": "IOS","modelName": "iPhone","language": "en","timezone": "America/Los_Angeles","version_number": "8.3","advertising_uid": "A2DCA463-9CA9-4D2A-AAE2-CF6D0978E2EC","app_version": "0.9.38","phone_country_code": "310","bundle_id": "com.relcy-labs.Relcy","screenWidth": 375,"screenHeight": 667,"screenScale": 2.0,"timestamp_utc": 1434948093583}]}   }}';
		var response = JSON.parse(tmpJson);
		response.hgetall.user = response.hgetall.user
		response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")   
		try{
			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
			if(thirdParty.third_party_service=='FACEBOOK'){
				response.hgetall.hasFBUrl = true;
				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
			}
		}catch(err){
			response.hgetall.hasFBUrl = false;
		}
		$scope.rejectedRecords.push(response.hgetall); 
		
		// StatusService.getRecordByKeys({key:key},function(response){
		// 	console.log(response);
		// 	response.hgetall.user = JSON.parse(response.hgetall.user)
		// 	response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No")   
		// 		try{
		// 			var thirdParty = response.hgetall.user.user_data.third_party_data[0];
		// 			if(thirdParty.third_party_service=='FACEBOOK'){
		// 				response.hgetall.hasFBUrl = true;
		// 				response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
		// 			}
		// 		}catch(err){
		// 			response.hgetall.hasFBUrl = false;
		// 		}
		// 		$scope.approvedRecords.push(response.hgetall); 
		// },function(error){
		// 	console.log(error)
		// });
	}

	// function addRecords(key,index)
	// {
	// 	StatusService.getRecordByKeys({key:key},function(response){
	// 		console.log(response);
	// 		response.hgetall.user = JSON.parse(response.hgetall.user)
	// 		response.hgetall.smsent = (response.hgetall.smsid ? "Yes":"No") 
	 
	// 		if(response.hgetall.status == "PENDING")
	// 		{	

	// 			try{
	// 				var thirdParty = response.hgetall.user.user_data.third_party_data[0];
	// 				if(thirdParty.third_party_service=='FACEBOOK'){
	// 					response.hgetall.hasFBUrl = true;
	// 					response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
	// 				}
	// 			}catch(err){
	// 				response.hgetall.hasFBUrl = false;
	// 			}
	// 			$scope.pendingRecords.push(response.hgetall);
	// 		}
	// 		else if(response.hgetall.status == "APPROVED")
	// 		{
	// 			try{
	// 				var thirdParty = response.hgetall.user.user_data.third_party_data[0];
	// 				if(thirdParty.third_party_service=='FACEBOOK'){
	// 					response.hgetall.hasFBUrl = true;
	// 					response.hgetall.fbURL = 'https://www.facebook.com/' + thirdParty.fixed_id;
	// 				}
	// 			}catch(err){
	// 				response.hgetall.hasFBUrl = false;
	// 			}
	// 			$scope.approvedRecords.push(response.hgetall);
	// 		}
	// 		else
	// 		{
	// 			$scope.rejectedRecords.push(response.hgetall)
	// 		}
			
	// 		// index++;
	// 		// if ($scope.keys.length > index) {
	// 		// 	addRecords($scope.keys[index],index)
	// 		// };
	// 	},function(error){
	// 		console.log(error)
	// 	});
	// }
	//
	$scope.approve = function(data,type)
	{
		$scope.approveRequest(data.user.invite_id,type)
	}
	//
	$scope.reject = function(data,type)
	{
		$scope.rejectRequest(data.user.invite_id,type)
	}
	//
	$scope.showAllPendingApprovals = function()
	{
		//
	}
	//
	$scope.showAllApprovedUser = function()
	{
		//
	}
	//
	$scope.showAllRejectedUser = function()
	{
		//
	}
	$scope.getKeys();
});
