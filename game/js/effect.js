function effectParse(card){ //return triggerSettings to indicate when effects activate
  //card.effects
  //assume effects to be array of strings
  // Structure as: 
  //  effects[0] = trait1, e[1] = trait2, e[2] = trait3, e[3] = desc to parse
  //

  //triggerSettings values
  //[0]: activation timing (1,2,3,4,5 null) Search @ParseActivator to find values
  //[1]: effect to be given (see effectList)
    // magnitude  of effect (depends on effect, can be null for some effects)
    // targetNumber
    // targetLocation
    // restriction[]
        // chosen, random, all : refer to field locations
        // graveyard, deck, hand : always random
        // self : always targets self
  //[2]: effect to be given (see effectList)
        // magnitude  of effect (depends on effect, can be null for some effects)
    // targetNumber
    // targetLocation
    // restriction[]
        // chosen, random, all : refer to field locations
        // graveyard, deck, hand : always random
        // self : always targets self
  var triggerSettings = [ "", effect1, effect2];
  var effect1 = {magnitude: null, targetNumber: null, targetLocation: null, restrictions: ['']};
  var effect2 = {magnitude: null, targetNumber: null, targetLocation: null, restrictions: ['']};
  var targetSelectionsList = ["All","Chosen","Deck","Hand","Graveyard","Self","Random"];
  var restrictionsList = ["Machine","Building","Augment","<2 mcost","<3 mcost","<2 attack","<3 attack","Lane","Self","Own","Taunt","<1 attack","<2 def","<4 attack","Taunt","<4 mcost","Not Player"];
  var LastTwoParamEffectIndex = 6;
  var LastOneParamEffectIndex = LastTwoParamEffectIndex+2;
  var effectList = [ //determine when effects are activated
    "Buff","Give",
    "BuffAll",
    "Damage","Deal",
    "Destroy",
    "Heal",
    "Recruit",
    "Revive",
    //Effects below this point only require one parameter
    "Discard",
    "Draw",
     //Effects require no parameters
     "Charge",
     "Lifesteal"
  ];

  var effectActivators = [
    "Battlecry",
    "Deathrattle",
    "Turn", //used for beginning of turn effect trigger
    "OnAttack", //include Taunt as an activator?
    "Taunt"
  ]
  //@ParseActivator
    //check trait1 - trait3 for Battlecry, or check type for Augment
    if (card.effect[0].includes(effectActivator[0], 0) || card.effect[1].includes(effectActivator[0], 0) || card.effect[2].includes(effectActivator[0], 0)|| card.type == "Augment")
      {triggerSettings[0] = "Battlecry";} //This effect should trigger on entry to the battlefield
    //check trait1 - trait3 for Deathrattle
    else if (card.effect[0].includes(effectActivator[1], 0) || card.effect[1].includes(effectActivator[1], 0) || card.effect[2].includes(effectActivator[1], 0))  //check card traits
      {triggerSettings[0] = "Deathrattle";} //This effect should trigger on exit from the battlefield
    //check card desc for Turn keyword
    else if (card.effect[3].includes(effectActivator[2]), 0)  //search card desc
      {triggerSettings[0] = "Turn Start";} //This effect triggers on start of turn
    //check trait1 - trait 3 for Lifesteal
    else if (card.effect[0].includes(effectActivator[3], 0) || card.effect[1].includes(effectActivator[3], 0) || card.effect[2].includes(effectActivator[3], 0))  //search card desc
      {triggerSettings[0] = "Attack";}  //This effect triggers on attack
    //check for Taunt
      else if (card.effect[0].includes(effectActivator[4], 0) || card.effect[1].includes(effectActivator[4], 0) || card.effect[2].includes(effectActivator[4], 0))  //search card desc
      {triggerSettings[0] = "Taunt";}  //This is Taunt
    //card has no activator, and must therefore have no effect, return null triggerSettings
    else{
      triggerSettings[0] = null; //This card has no effects, effect activator processing complete
      return triggerSettings;
    }  
  //Parse the description for effects
  //First identify keyword, generally the next number indicates magnitude of effect
  //Exception(s) are: 'Give'
  var triggerIndex = 1;
  effectSplitArray = effect[3].split(", ");
  //check the split array for card effect
  while (triggerIndex < 3){
    for(var i = 0; i< effectSplitArray.length; ++i){ //at most 2 iterations
        effectString = effectSplitArray[i].split(" ");
        switch(effectSplitArray[i]){
          case "Deal":
          case "Draw":
          case "Give":
          case "Heal":
          case "Reduce":  //Magnitude, TargetNumber, Location, Restriction
            for (var k = 0; k < effectString.length; ++k){ 
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].targetNumber == null){ //first number in desc is always magnitude
                triggerSettings[triggerIndex].magnitude = effectString[k];
              } 
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].magnitude != null){ //second number is always target number
                triggerSettings[triggerIndex].targetNumber = effectString[k];
              }
            }
            for( var k = 0; k <effectString.length; k++){ //check targetlocation list against card desc
              for( var m = 0; m < targetSelectionsList.length; ++m){
                if(effectString[k].includes(targetSelectionsList[m])){
                  triggerSettings[triggerIndex].targetSelection.concat(targetSelectionsList[m]);
                }
                else{
                  triggerSettings[triggerIndex].targetSelection.concat("Chosen");
                }
              }
            }
            var restrictionIndex = 0;
            for( var k = 0; k <effectString.length; k++){ //restrictions to check for in remaining string
              for( var m = 0; m <restrictionsList.length; ++m){
                if(effectString[k].includes(restrictionsList[m])){
                  triggerSettings[triggerIndex].restrictions[restrictionIndex].concat(restrictionsList[m]);
                  restrictionIndex++;
                }
              }
            }
            if (restrictionIndex == 0){ triggerSettings[triggerIndex].restrictions[restrictionIndex].concat("None");}
            break;
            
          
          case "Destroy": //Magnitude, TargetNumber, Location, Restriction
            for (var k = 0; k < effectString.length; k++){ 
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].targetNumber == null){ //first number in desc is always magnitude
                triggerSettings[triggerIndex].magnitude = effectString[k];
              } 
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].magnitude != null){ //second number is always target number
                triggerSettings[triggerIndex].targetNumber = effectString[k];
              }
            }
            for( var k = 0; k <effectString.length; k++){ //check targetlocation list against card desc
              for( var m = 0; m < targetSelectionsList.length; m++){
                if(effectString[k].includes(targetSelectionsList[m])){
                  triggerSettings[triggerIndex].targetSelection.concat(targetSelectionsList[m]);
                }
                else{
                  triggerSettings[triggerIndex].targetSelection.concat("Chosen");
                }
              }
            }
            var restrictionIndex = 0;
            for( var k = 0; k <effectString.length; k++){ //restrictions to check for in remaining string
              for( var m = 0; m <restrictionsList.length; m++){
                if(effectString[k].includes(restrictionsList[m])){
                  triggerSettings[triggerIndex].restrictions[restrictionIndex].concat(restrictionsList[m]);
                  restrictionIndex++;
                }
              }
            }
            if (restrictionIndex == 0){ 
              triggerSettings[triggerIndex].restrictions[restrictionIndex].concat("Not Player");
            }
            break;

          case "Recruit":  //Magnitude, TargetNumber, Location, Restriction
            for (var k = 0; k < effectString.length; k++){ 
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].targetNumber == null){ //first number in desc is always magnitude
                triggerSettings[triggerIndex].magnitude = effectString[k];
              } 
              //second number is always target number
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].magnitude != null){ 
                triggerSettings[triggerIndex].targetNumber = effectString[k];
              }
             //check targetlocation list against card desc
              for( var m = 0; m < targetSelectionsList.length; m++){
                if(effectString[k].includes(targetSelectionsList[m])){
                  triggerSettings[triggerIndex].targetSelection.concat(targetSelectionsList[m]);
                }
                else{
                  triggerSettings[triggerIndex].targetSelection.concat("Random");
                }
              }
            }
            
            var restrictionIndex = 0;
            for( var k = 0; k <effectString.length; k++){ //restrictions to check for in remaining string
              for( var m = 0; m <restrictionsList.length; ++m){
                if(effectString[k].includes(restrictionsList[m])){
                  triggerSettings[triggerIndex].restrictions[restrictionIndex].concat(restrictionsList[m]);
                  ++restrictionIndex;
                }
              }
            }
            if (restrictionIndex == 0){ triggerSettings[triggerIndex].restrictions[restrictionIndex].concat("None");}
            break;
            //TargetNumber, Location, Restriction

          case "Revive":  //Magnitude, TargetNumber, Location, Restriction
            for (var k = 0; k < effectString.length; ++k){ 
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].targetNumber == null){ //first number in desc is always magnitude
                triggerSettings[triggerIndex].magnitude = effectString[k];
              } 
              if(effectString[k].isInteger() && triggerSettings[triggerIndex].magnitude != null){ //second number is always target number
                triggerSettings[triggerIndex].targetNumber = effectString[k];
              }
            for( var k = 0; k <effectString.length; k++){ //check targetlocation list against card desc
              for( var m = 0; m < targetSelectionsList.length; ++m){}
                if(effectString[k].includes(targetSelectionsList[m])){
                  triggerSettings[triggerIndex].targetSelection.concat(targetSelectionsList[m]);
                }
                else{
                  triggerSettings[triggerIndex].targetSelection.concat("Random");
                }
              }
            }
            var restrictionIndex = 0;
            for( var k = 0; k <effectString.length; k++){ //restrictions to check for in remaining string
              for( var m = 0; m <restrictionsList.length; ++m){
                if(effectString[k].includes(restrictionsList[m])){
                  triggerSettings[triggerIndex].restrictions[restrictionIndex].concat(restrictionsList[m]);
                  restrictionIndex++;
                }
              }
            }
            if (restrictionIndex == 0){ triggerSettings[triggerIndex].restrictions[restrictionIndex].concat("Machine");}
            break;
            //Magnitude, TargetNumber, Location, Restriction
          case "Immune":
            break;
        }
    }
    triggerIndex++;  
  }
  return triggerSettings;
}

function EffectFactory(){ //effectory? //Generate board callback methods
  
} 
