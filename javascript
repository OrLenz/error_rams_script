<script>
    function rem_item(_this){
		_this.closest('tr').remove()
	}
// hitung total
	function calculate(){
		var _total = 0
		$('.po-item').each(function(){
			var qty = $(this).find("[name='qty']").val()
			var price = $(this).find("[name='price']").val()
			var row_total = 0;
			if(qty > 0 && price > 0){
				row_total = parseFloat(qty) * parseFloat(price)
			}
			$(this).find('.total-price').text(parseFloat(row_total).toLocaleString('en-US'))
		})
		$('.total-price').each(function(){
			var _price = $(this).text()
				_price = _price.replace(/\,/gi,'')
				_total += parseFloat(_price)
		})
		var discount_perc = 0
		if($('[name="discount"]').val() > 0){
			discount_perc = $('[name="discount"]').val()
		}
		var discount_amount = _total * (discount_perc/100);
		$('[name="discount_amount"]').val(parseFloat(discount_amount).toLocaleString("en-US"))
		var tax_perc = 0
		if($('[name="tax"]').val() > 0){
			tax_perc = $('[name="tax"]').val()
		}
		var tax_amount = _total * (tax_perc/100);
		$('[name="tax_amount"]').val(parseFloat(tax_amount).toLocaleString("en-US"))
		$('#sub_total').text(parseFloat(_total).toLocaleString("en-US"))
		$('#total').text(parseFloat(_total-discount_amount).toLocaleString("en-US"))
	}
// selesaikan text (gak kepake)
	function _autocomplete(_item){
		_item.find('.item_id').autocomplete({
			source:function(request, response){
				$.ajax({
					url:_base_url_+"classes/Master.php?f=search_items",
					method:'POST',
					data:{q:request.term},
					dataType:'json',
					error:err=>{
						console.log(err)
					},
					success:function(resp){
						response(resp)
					}
				})
			},
			select:function(event,ui){
				console.log(ui)
				_item.find('input[name="item_id"]').val(ui.item.id)
				_item.find('.item-description').text(ui.item.description)
			}
		})
	}

// tambah baris
    $(document).ready(function(){
		$('#add_row').click(function(){
			var tr = $('#item-clone tr').clone()
			$('#item-list tbody').append(tr)
			_autocomplete(tr)
			tr.find('[name="qty"],[name="stuff"]').on('input keypress',function(e){
				calculate()
			})
			$('#item-list tfoot').find('[name="discount"],[name="tax"]').on('input keypress',function(e){
				calculate()
			})
		})
		if($('#item-list .po-item').length > 0){
			$('#item-list .po-item').each(function(){
				var tr = $(this)
				_autocomplete(tr)
				tr.find('[name="qty"],[name="price"]').on('input keypress',function(e){
					calculate()
				})
				$('#item-list tfoot').find('[name="discount"],[name="tax"]').on('input keypress',function(e){
					calculate()
				})
				tr.find('[name="qty"],[name="price"]').trigger('keypress')
			})
		}else{
		$('#add_row').trigger('click')
		}
        $('.select2').select2({placeholder:"Please Select here",width:"relative"})      
	})
</script>
