   <!-- The header section - the big black banner at the top of screen -->
   <div id="header-container">

       <!-- A thin strip containing some small controls at the top right -->
       <div id="header-controls">
           <ul>
               <li><a href="mailto:cg-portal@csiro.au">Contact Us</a></li>
               <li><a href="#auscope-tabs-panel">Skip to Content</a></li>
               <!-- TODO check with Ollie whether we can leave out this awful feature 
                   <li><a id="resize-link" href="#auscope-tabs-panel">A <span class="smaller">A</span></a></li>             
               --> 
           </ul>    
       </div>         

	    <span id="ausgin-header">AUSGIN</span> 
	    <span class="ga-portal-header">GEOSCIENCE PORTAL</span> 
	             
        <label for="basic-search-input">Search for data and publications</label>
        <div class="search-input-wrapper">
            <input type="text" id="basic-search-input" name="searchBox" maxlength="50"/>
            <button id="basic-search-button"/>
        </div>
        <a id="advanced-search-link" href="javascript:void(0)">Advanced Search</a>
        <a id="clear-search-link" href="javascript:void(0)">Clear Search</a>

   </div>
   
   <div id="menu-bar">
       <ul>
           <li><a href="mailto:cg-portal@csiro.au"><img src="img/home.png" width="16" height="16"/>AUSGIN HOME</a></li>
           <li><a href="#auscope-tabs-panel"><img src="img/print.png" width="16" height="16"/>PRINT MAP</a></li>
           <li><a href="#auscope-tabs-panel"><img src="img/reset.png" width="16" height="16"/>RESET MAP</a></li>
           
           <li>
               <span id="permanent-link">
               <a href="javascript:void(0)">
                   <img src="img/link.png" width="16" height="16"/>
                   PERMANENT LINK
               </a>
               </span>
           </li>
           
           <li><a id="help-button"><img src="img/help.png" width="16" height="16"/>HELP</a></li>          
           
           <span id="latlng"></span>     
       </ul>   
   </div>
