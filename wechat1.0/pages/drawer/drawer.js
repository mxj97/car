import xapi from "../../utils/xapi"
export default function drawer(page){
    let root=page;
    var drawerW = root.data.winWidth * 0.8;   //设置宽度
    console.log(page);
    Object.assign(root,{
        hideDrawer(){
            root.setData(  //mask 
                {  
                showDrawerFlag: false,
                scrollBoolean:true,
                showmask: false,
                }  
            );  
            var animationDrawer = wx.createAnimation({  
                duration: 300,   
                timingFunction: "linear",  
                delay: 0 
            });  
            page.animationDrawer = animationDrawer;  
            animationDrawer.translateX(drawerW).step();  
            page.setData({  
              animationDrawer: animationDrawer.export()  
            })
        },
        showDw(){

          // 测试drawer调用brand
          var animationDrawer = wx.createAnimation({  
                duration: 300,   
                timingFunction: "linear",  
                delay: 0 
            });  
          root.animationDrawer = animationDrawer;  
          animationDrawer.translateX(-drawerW).step();
            root.setData(  //mask 
                { 
                    showDrawerFlag: true,
                    animationDrawer: animationDrawer.export(),
                    scrollBoolean: false,
                    showmask: true,
                }  
            );
        },
        aa:function(){
            console.log('brand调用--------------------------------->drawer');
        },

    })
    // 请求数据
    this.requestdata = function (data,isback) { 
      root.setData({
        drawerSeriesData:{}
      });
      root.showDw();
    };


}