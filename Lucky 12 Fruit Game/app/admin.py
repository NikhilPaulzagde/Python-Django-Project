from django.contrib import admin
from .models import MyModel,BetHistory,BetResult

admin.site.register(MyModel)

class BetHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'fruit', 'quantity', 'amount', 'ticket')
    search_fields = ('user', 'fruit', 'ticket')

admin.site.register(BetHistory, BetHistoryAdmin)



class BetResultAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'winning_fruit', 'amount', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username']

    def change_winning_fruit(self, request, queryset):
        
        new_winning_fruit = 'new_fruit'  
        queryset.update(winning_fruit=new_winning_fruit)

    change_winning_fruit.short_description = "Change Winning Fruit"  

admin.site.register(BetResult,BetResultAdmin)  