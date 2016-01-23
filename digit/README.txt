Dig-It! Games coding assessment solution / Don Peterkofsky
==========================================================

This solution addresses the following requirements:

1. Create a web app that drills addition equations.  This is 
implemented in the "Game" state of the application.

2. The app should appear as a native application on iOS when 
it is installed on the device home screen.  This is addressed 
by adding the special Apple meta-tag to the index.html, as 
discussed with Steve.

3. It should also run in a browser.  Yes, it does.

4. The app should display three screens: a main menu, an equation 
screen, and an end of game screen.  This is addressed by the three 
application states: Home, Game, Results.

Caveats -

Due to time constraints, the following requirements were not implemented:

1. "In this manner, display five addition equations, alternating 
between displaying the equation vertically and horizontally."  The 
solution does not do the alternating between two layouts; all 
equations are displayed horizontally.

2. "The end of game screen should display a list of all of the equations 
presented to the player, along with the player’s solution and an indication 
of whether the solution was correct or not."  The individual equations and 
solutions are not displayed; only an indication of correct/incorrect for 
each equation is displayed.

Also, the layout in the various application states is not ideal, as a function 
of the HTML5 game framework I used.  And, there is a small bug when returning
to a new game via "Play Again", which I haven't yet resolved.

Bonus -> Dragging/dropping the digits plays a sound, and an appropriate sound is 
played for correct and incorrect answers when all digits have been placed.