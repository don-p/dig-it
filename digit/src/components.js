
// Component definition -
// The empty box to hold a digit.  User drags a 
// digit to this box, and collision detection 
// on dragStop of dragged component updates this box.
Crafty.c('digitBox', {
  init: function() {
    this.requires('2D, DOM, Text')
    .attr({y: 240 })
    .css({'margin-left':'auto', 'margin-right':'auto', 'background-color':'rgb(20, 125, 240)', 'border':'1px solid #000', 'padding':'3px', 'float':'left'})
    this.textFont({ size: '48px', weight: 'bold' })
  }
});

// Component definition -
// The box to hold a pre-set digit value.  User 
// drags this digit box to the empty digit holder; 
// this object's collision detection is triggered 
// on dragStop, to update the target's display value.
Crafty.c('digitItem', {
  init: function() {
    this.requires('2D, DOM, Text, Mouse, Draggable, Collision');
    this.attr({y: 400 })
    .collision();
    this.z = 10000;
    this.textFont({ size: '48px', weight: 'bold' })
    this.css({'margin-left':'auto', 'margin-right':'auto', 'background-color':'rgb(105, 205, 248)', 'border':'1px solid #000', 'padding':'3px', 'float':'left'});

    this.bind("StopDrag", function() {
        console.log("STOP " +     this.x + " " +     this.y );
        var hit = this.hit('digitBox');
        if(hit){
        	// Set the value in the drop box to the value from the dragged box.
        	hit[0].obj.text(this.text());
        	Crafty.audio.play("place");
        	Crafty.trigger('digitSet');
         }
    	// Return the draggable to its original position.
    	this.x = this._oldX
    	this.y = this._oldY
    });
    
  }
});


