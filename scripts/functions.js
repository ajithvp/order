/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

 var that = this;
    $(':input').blur(function(){
        that.onFocusLoss();
    });

onFocusLoss : function() {
    try {
        $("[data-position='fixed']").fixedtoolbar();
        $("[data-position='fixed']").fixedtoolbar('destroy');
        $("[data-position='fixed']").fixedtoolbar();
        console.log('bam');
    } catch(e) {
        console.log(e);
    }
}
