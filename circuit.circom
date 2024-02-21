pragma circom 2.0.0;

template Factor () {  
   signal input p;  
   signal input q;  
   signal output n;  

   // Constraints.  
   n <== p * q;  
}

component main = Factor();