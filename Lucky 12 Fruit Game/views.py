from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from .models import MyModel,BetResult,BetHistory
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
import json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.utils import timezone
from pytz import timezone as tz
from django.http import JsonResponse
from datetime import datetime
from django.http import HttpResponseServerError
from django.http import HttpResponse, HttpResponseServerError
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime


def index(request):
    fruits = ["banana", "apple", "lemon", "mango", "guava", "papaya", "pineapple","tomato" ,"chillie","lychee", "orange", "kiwi"]
    selected_amounts = {}  # Provide selected amounts for each fruit as needed
    data = MyModel.objects.first()  # Fetch only the first record

    context = {'fruits': fruits, 'selected_amounts': selected_amounts, 'data': data}
    return render(request, 'index.html', context)

@csrf_exempt
def update_balance(request):
    if request.method == 'POST' and request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        new_balance = request.POST.get('new_balance')

        try:
            MyModel.objects.update_or_create(id=1, defaults={'amount': Decimal(new_balance)})
            return JsonResponse({'message': 'Balance updated successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
    else:
        return JsonResponse({'error': 'Invalid request type'})


def bet_History(request):
    # Retrieve betting history from the database
    betting_history = BetHistory.objects.all()
    context = {'betting_history': betting_history}
    return render(request, 'bet_History.html', context)

def place_bet(request):
    if request.method == 'POST':
        user = "nikhil"  # Assuming the user is fixed for now
        betting_data_json = request.POST.get('betting_data')
        betting_data = json.loads(betting_data_json)

        for entry in betting_data:
            BetHistory.objects.create(user=user, fruit=entry['fruit'], quantity=entry['quantity'], amount=entry['amount'],ticket=entry['ticket'])

        return JsonResponse({'message': 'Bet placed successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'})
  
@csrf_exempt
def add_bet_result(request):
    if request.method == 'POST':
        user = request.POST.get('user')
        winning_fruit = request.POST.get('winning_fruit')
        amount = request.POST.get('amount')
        fruit_image_url = request.POST.get('fruit_image_url')  # Get the fruit image URL
        number_image_url = request.POST.get('number_image_url')  # Get the number image URL
        result_image_url = request.POST.get('result_image_url')
      
        # Create BetResult object
        bet_result = BetResult.objects.create(
            user=user,
            winning_fruit=winning_fruit,
            amount=amount,
            fruit_image_url=fruit_image_url, 
            number_image_url=number_image_url,
            result_image_url =result_image_url
            
        )

        # Save the object
        bet_result.save()

        return JsonResponse({'message': 'Bet result added successfully.'})
    else:
        return JsonResponse({'error': 'Invalid request method.'})
    
def fetch_history(request):
    bet_results = BetResult.objects.order_by('-created_at')[:10]
    bet_results_data = []

    for result in bet_results:
        # Convert the timestamp to Kolkata timezone
        kolkata_time = result.created_at.astimezone(timezone.get_current_timezone()).strftime('%H:%M:%S')
        
        bet_results_data.append({
            'winning_fruit': result.winning_fruit,
            'amount': result.amount,
            'timestamp': kolkata_time,
            'fruit_image_url': result.fruit_image_url,  # Add fruit_image_url to the response
            'number_image_url': result.number_image_url  # Add
            # Add the URL for the times image
        })

    return JsonResponse({'bet_results': bet_results_data})

def generate_pdf(request):
    try:
        user = request.GET.get('user', 'Anonymous')
        fruit = request.GET.get('fruit', '')
        quantity = request.GET.get('quantity', '0')
        amount = request.GET.get('amount', '0')
        ticket = request.GET.get('ticket', '')
        bet_time = datetime.now()  # Use current time as bet time

        # Generate PDF content based on bet details
        buffer = generate_pdf_content(user, fruit, quantity, amount, ticket, bet_time)

        # Create HTTP response with PDF content
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'filename="bet_history.pdf"'
        response.write(buffer.getvalue())
        buffer.close()

        return response
    except Exception as e:
        # Log the error message
        print("An error occurred:", e)
        # Return an HTTP 500 response with an error message
        return HttpResponseServerError("Internal Server Error")

def generate_pdf_content(user, fruit, quantity, amount, ticket, bet_time):
    # Create a buffer to store PDF data
    buffer = BytesIO()

    # Create a canvas
    c = canvas.Canvas(buffer, pagesize=letter)

    # Define font and font size
    c.setFont("Helvetica", 12)

    # Define slip content
    content = [
        f"User: {user}",
        f"Fruit: {fruit}",
        f"Quantity: {quantity}",
        f"Amount: {amount}",
        f"Ticket: {ticket}",
        f"Time: {bet_time.strftime('%Y-%m-%d %H:%M:%S %Z')}"
    ]

    # Draw slip content on the canvas
    y = 700
    for line in content:
        c.drawString(100, y, line)
        y -= 20

    # Save the canvas content
    c.save()

    return buffer
