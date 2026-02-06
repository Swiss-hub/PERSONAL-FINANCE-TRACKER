from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import ListCreateAPIView



class TransactionListCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # incoming GET transactions
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            serializer = TransactionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except Exception:
            return Response({"detail":"internal server error"}, status=500)

    
class TransactionDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        # get_object called
        try:
            return Transaction.objects.get(pk=pk, user=user)
        except Transaction.DoesNotExist:
            return None

    def get(self, request, pk):
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response(status=404)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    def put(self, request, pk):
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response(status=404)
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        # delete called
        transaction = self.get_object(pk, request.user)
        if not transaction:
            return Response(status=404)
        transaction.delete()
        return Response(status=204)


class SummaryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        income = (
            Transaction.objects.filter(user=user, transaction_type="income")
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        expenses = (
            Transaction.objects.filter(user=user, transaction_type="expense")
            .aggregate(total=Sum("amount"))["total"] or 0
        )

        balance = income - expenses

        return Response({
            "total_income": income,
            "total_expenses": expenses,
            "balance": balance
        })
