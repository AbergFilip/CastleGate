import { Module } from '@nestjs/common';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { CardsModule } from './cards/cards.module';
import { InvestmentsModule } from './investments/investments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [
    BankAccountsModule,
    CardsModule,
    InvestmentsModule,
    TransactionsModule,
    LoansModule,
  ],
  exports: [
    BankAccountsModule,
    CardsModule,
    InvestmentsModule,
    TransactionsModule,
    LoansModule,
  ],
})
export class EconomyModule {}

