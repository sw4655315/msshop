Mock.mock('http://g.cn/app/product/promote', {
	'resCode|1':[200,200]
	,'resMsg':'@cname'
	,'resObj':{
		'page':{
			'currentPageCount|0-20':1
			,'pageNumber':1
			,'first':true
			,'last':false
			,'pageSize':20 
			,'totalPage':20
			,'totalCount':20
		}
	    ,'pLists|20-25':[
	        {
	            'main_photo': Mock.Random.image('200x200', Mock.Random.color(), '@name'),
	            'nprice|100-100000': 100,
	            'oprice|1-100': 100,
	            'title': '@csentence'
	        }
	    ]
	}
	
});