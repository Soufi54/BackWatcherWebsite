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

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


  paypal.Buttons({

    style: {
        layout:  'vertical',
        height: 50,
        color:   'gold',
        shape:   'rect'
          },

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
    onError: function (err) {
        // Show an error page here, when an error occurs
        //window.location.href = "Payment.html";
        document.getElementById("InformationSpan").innerHTML = "An error occured during the checkout, please start again the payment process or send us an email to backwatcherdev@gmail.com"

    },
    onCancel: function (data) {
        // Show a cancel page, or return to cart
        window.location.href = "Payment.html";

      },


    // Finalize the transaction
    onApprove: function(data, actions) {
        actions.order.capture().then(function(details) {
            // Show a success message to the buyer
            //alert('Transaction completed by ' + details.payer.email_address + '!');

            document.getElementById("container1").style.display = "none";
            document.getElementById("paymentH1").style.display = "none";
            document.getElementById("InformationSpan").innerHTML = "Creating your account... "



            //check if email was received else show error page account creation --> the account will be created manually
            
            CreateAccount({name: details.payer.name.given_name, email: details.payer.email_address}).then(result => {
                console.log(result);
                email = result.data.email;
                LicenseKey = result.data.password;
                
                if(validateEmail(details.payer.email_address) && (LicenseKey.length >5)){
                    document.getElementById("InformationSpan").innerHTML = ""
                    document.getElementById("SuccessfulPayment").style.display = "block";
                    document.getElementById("email").innerHTML =  email;
                    document.getElementById("password").innerHTML = LicenseKey;
                    //alert(result.data.text);
                }else{
                    document.getElementById("InformationSpan").innerHTML = "An error occured during the account creation, please send us an email to backwatcherdev@gmail.com, your account will be manually created."

                }

            });

        });
    }
    
}).render('#paypal-button-container');
  