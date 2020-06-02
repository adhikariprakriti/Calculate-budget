 //Data Controller
var dataController=(function(){
   var Expense =function(id,description,value){
    this.id=id;
    this.description= description;
    this.value= value;
    this.percentage=-1;
};

Expense.prototype.calcPercentage=function(totalInc){
    if(totalInc>0){
    this.percentage=Math.round((this.value/totalInc)*100);
    }else{
        this.percentage=-1;
    }
}
Expense.prototype.getPerc=function(){
    return this.percentage;
}

var Income =function(id,description,value){
    this.id=id;
    this.description= description;
    this.value= value
};

var data={
    allItems:{
        inc:[],
        exp:[]
    },
    totals:{
        exp:0,
        inc:0
    },
      budget:0,
      percentage: -1
    };

   var calculateBudget= function(type){
       var sum=0;
        data.allItems[type].forEach(function(cur){
             sum+=cur.value;
        });
        data.totals[type]=sum;
   } ; 



return{
    addItem: function(type,des,val){
        var newItem,ID;
        //creqate new id
        if(data.allItems[type].length>0){
        var ID=data.allItems[type][data.allItems[type].length-1].id+1;
        }else{
            ID=0;
        }
        //create new item
        if(type==="exp"){ 
            newItem=new Expense(ID,des,val);

        }else{
            newItem=new Income(ID,des,val);
        }
        //push into data structure
        data.allItems[type].push(newItem);
        return newItem;
    },



    deleteItem: function(type,id){

     var ids=data.allItems[type].map(function(current){
           return current.id;
      });
       console.log(ids);
      var index=ids.indexOf(id);
      console.log(index);
      if(index!==-1){
          data.allItems[type].splice(index,1);
      }


    },

    calculateBudget: function(){
        //calculate total income and expenses
        calculateBudget("exp");
        calculateBudget("inc");

        //calculate the budget
        data.budget=data.totals.inc-data.totals.exp;

        //calculate the percentage of income that we spent
        if(data.totals.inc>0){
          data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
        }else{
            data.percentage=-1;
        }
        },

        calculatePercentage:  function(){
          
         data.allItems.exp.forEach(function(cur){
                  cur.calcPercentage(data.totals.inc);
         });
        },

       getPercentage:function(){
         var allperc=data.allItems.exp.map(function(cur){
           return cur.getPerc(); 
           });
           return allperc;
       },


    getBudget: function(){
          return{
              budget: data.budget,
              totalInc:data.totals.inc,
              totalExp:data.totals.exp,
              percentage:data.percentage
          };
    },

    testing:function(){
        console.log(data);
    }
};
 
})();




//UI controller
var UIController=(function(){

     var DOMStrings={
         inputType:".add__type",
         inputDescription:".add__description",
         inputValue:".add__value",
        addButton: ".add__btn",
        expensesContainer:".expenses__list",
        incomeContainer:".income__list",
        container:".container "
     }


    return{
        getInput: function(){
            return{
             type: document.querySelector(DOMStrings.inputType).value,
             description: document.querySelector(DOMStrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            } ;
        },

        getDOMStrings: function(){
            return DOMStrings;
        },

        addList: function(obj,type){
            var html;

            //html portion to be added
            
            if(type=="inc"){
            html =`<div class="item clearfix" id="inc-${obj.id}">
           <div class="item__description">${obj.description}</div>
           <div class="right clearfix">
               <div class="item__value">${obj.value}</div>
               <div class="item__delete">
                   <button class="item__delete--btn"><i class="ion-ios-close-outline"></i>del</button>
               </div>
           </div>
       </div>`;

       //Insert html into specified position
       document.querySelector(DOMStrings.incomeContainer).insertAdjacentHTML("beforeend",html);

            }else{
               html=` <div class="item clearfix" id="exp-${obj.id}">
               <div class="item__description">${obj.description}</div>
               <div class="right clearfix">
                   <div class="item__value">${obj.value}</div>
                   <div class="item__percentage">21%</div>
                   <div class="item__delete">
                       <button class="item__delete--btn"><i class="ion-ios-close-outline"></i>del</button>
                   </div>
               </div>
           </div>`;

          //Insert html into specified position
           document.querySelector(DOMStrings.expensesContainer).insertAdjacentHTML("beforeend",html);

            }

/*
         //replace placeholdertext with some actual value
         newHtml=html.replace("%id%",obj.id);
         newHtml=newhtml.replace("%description%",obj.description);
         newHtml=newhtml.replace("%value%",obj.value);
*/
        },

        deleteList: function(selectedId){
            var list=document.getElementById(selectedId);
            list.parentNode.removeChild(list);
        },

      clearinput: function(){
        //document.querySelector(DOMStrings.inputType).value="";
         document.querySelector(DOMStrings.inputDescription).value="";
        document.querySelector(DOMStrings.inputValue).value="";
        document.querySelector(DOMStrings.inputDescription).focus();
      },

      displayBudget: function(obj){
          document.querySelector(".budget__value").innerHTML=obj.budget;
          document.querySelector(".budget__income--value").innerHTML=obj.totalInc;
          document.querySelector(".budget__expenses--value").innerHTML=obj.totalExp;
          if(obj.totalInc>obj.totalExp){
            document.querySelector(".budget__expenses--percentage").innerHTML=obj.percentage + "%";

          }else{
            document.querySelector(".budget__expenses--percentage").innerHTML="--";

          }

      },

      displayMonth:function(){
    
       now=new Date();
       var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
       var month=now.getMonth();
       var year=now.getFullYear();
       document.querySelector(".budget__title--month").textContent=months[month]+" "+year;

      },





     displayPercentage: function(percentage){
         
     var fields=document.querySelectorAll(".item__percentage");

     NodeListforEach=function(list){
           for(var i=0;i<list.length;i++){
               if(percentage[i]>0){
               list[i].textContent=percentage[i]+"%";
               }
               else{
                list[i].textContent="--";

               }
           }
     };

     NodeListforEach(fields);

    }
      }; 
})();


//App Controller
var appController=(function(dataCtrl,UICtrl){

         //var DOM=UICtrl.getDOMStrings();
         

         var updateBudget= function(){
             //1.calculate bhdget
              dataCtrl.calculateBudget();
             //2.return budget
             var budget=dataCtrl.getBudget();

             //3.display the budget on UI
                console.log(budget);
                UICtrl.displayBudget(budget);
         };

         var updatePercentages=function(){
             //1.calculate percentage
               dataCtrl.calculatePercentage();
             //2.get percentage fron data controller
               perc=dataCtrl.getPercentage();
              // console.log(dataCtrl.getPercentage());               
             //3.display percentage in UI
            UICtrl.displayPercentage(perc);

         };

         var addItem=function(){
            //1.get input
           var input= UICtrl.getInput();
           //console.log(input);

           //2.add the input to data controller
          if(input.description!=="" &&  !isNaN(input.value) && input.value>0){
          var newItem=dataCtrl.addItem(input.type,input.description,input.value);
          
          //3.add the item to UI
               
           UICtrl.addList(newItem,input.type);

           

             //clear inputfields after addding item
             UICtrl.clearinput();
          
             //4.Calculate the budget
             updateBudget();

             //Update percentages
             updatePercentages();
          }
       // console.log("works");
      };

      var ctrlDeleteItem=function(event){
           var itemId=event.target.parentNode.parentNode.parentNode.id;
           
           if (itemId){
           splitID=itemId.split('-');
           type=splitID[0];
           ID=parseInt(splitID[1]);
           
            //console.log(type);
           //console.log(ID);

           //delete item from data structure
           dataCtrl.deleteItem(type,ID);
           //delete item from UI
           UICtrl.deleteList(itemId);
           //update and show new budget
           updateBudget(); 

           //update percentage
           updatePercentages();
           }
      };



    return{
      init:function(){
        UICtrl.displayBudget( {budget: 0,totalInc: 0,totalExp: 0,percentage: 0});

           UICtrl.displayMonth();
           document.querySelector(".add__type").focus();
        var DOM=UICtrl.getDOMStrings();

        document.querySelector(DOM.addButton).addEventListener("click",addItem);
          
         document.addEventListener("keypress",function(event){
        if(event.keyCode===13 || event.which===13){
                addItem();
        }
       });
      
        document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);
         

      //UICtrl.displayBudget( {budget: 0,totalInc: 0,totalExp: 0,percentage: 0});
       }
    };
   


})(dataController,UIController);


appController.init();

















































































































































































































































































