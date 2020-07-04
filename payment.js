firebase.initializeApp({
    apiKey: "AIzaSyAyo2yH4_S3c5KvKtB_YRzIkqJwyh87y1I",
    authDomain: "backwatcher.firebaseapp.com",
    projectId: "backwatcher",
    databaseURL: "https://backwatcher.firebaseio.com"
  });
  
  // Initialize Cloud Functions through Firebase
  
  
var functions = firebase.functions();
var email = "";
var LicenseKey = "";
var CreateAccount = firebase.functions().httpsCallable("CreateAccount");




  paypal.Buttons({

    // Set up the transaction
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '15.00'
                }
            }],
            application_context: {        
                shipping_preference: 'NO_SHIPPING'
            }
        });
    },

    // Finalize the transaction
    onApprove: function(data, actions) {
        actions.order.capture().then(function(details) {
            // Show a success message to the buyer
            alert('Transaction completed by ' + details.payer.name.given_name + '!');

            CreateAccount({name: details.payer.name.given_name, email: details.payer.name.email}).then(result => {
                console.log(result);
                email = result.data.email;
                LicenseKey = result.data.LicenseKey;
                //alert(result.data.text);
            });

        });
    }
    
}).render('#paypal-button-container');
  