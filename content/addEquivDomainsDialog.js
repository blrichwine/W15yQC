			var blr=this.arguments[0];
			blr.W15yQC.addEquivDomainsDialog = {
				 d: null,
				 ok: false,
				 checkFields: function() {
						blr.W15yQC.addEquivDomainsDialog.ok=/^[\w\-_]+(\.[\w\-_]+)+(\/[~\w\-_]+)*$/i.test(document.getElementById('tbDomain1').value) &&
																								/^[\w\-_]+(\.[\w\-_]+)+(\/[~\w\-_]+)*$/i.test(document.getElementById('tbDomain2').value);
				 },
				 doOK: function() {
						blr.W15yQC.addEquivDomainsDialog.checkFields();
						if(blr.W15yQC.addEquivDomainsDialog.ok) {
							 blr.W15yQC.addEquivDomainsDialog.d.d1=document.getElementById('tbDomain1').value;
							 blr.W15yQC.addEquivDomainsDialog.d.d2=document.getElementById('tbDomain2').value;
							 return true;
						} else {
							 alert('Values are not valid. Correct and try again, or cancel to exit.');
						}
						return false;
				 },
				 doCancel: function() {
						blr.W15yQC.addEquivDomainsDialog.d.d1='';
						blr.W15yQC.addEquivDomainsDialog.d.d2='';
						return true;
				 }
			};
			blr.W15yQC.addEquivDomainsDialog.d=this.arguments[1];
