import { TextAreaField, TextInputField, TokenInputField } from '@/components/form'
import { NavigationFooter } from '@/components/shared/navigation-footer'
// import { useTranslation } from 'next-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Flex } from 'theme-ui'
import { LoanFormStepsProps } from '@/types'
import {
	ContentCard,
	ContentCardSubtitle,
	ContentCardTitle,
	ContentCardWrapper,
} from './LoanDetails.styled'

type LoanDetailsProps = {
	goNextStep: () => void
	goBackStep: () => void
}

export const LoanDetails = ({ goNextStep, goBackStep }: LoanDetailsProps) => {
	// const { t } = useTranslation(['common', 'loan'])
	const {
		getValues,
		register,
		formState: { isValid, errors },
	} = useFormContext<LoanFormStepsProps>()

	return (
    <ContentCardWrapper>
      <ContentCard>
        <ContentCardTitle>
          {/* {t('loan:loan-details.title')} */}
          What are you looking for?
        </ContentCardTitle>
        <ContentCardSubtitle>
          {/* {t('loan:loan-details.subtitle')} */}
          Define your ideal terms for the loan that people can view and accept,
          or counter offer
        </ContentCardSubtitle>

        <TokenInputField
          label="Tokens I'm interested in" // {t('loan:loan-details.token-label')}
          id="tokenAmount"
          {...register("tokenAmount")}
          fieldError={errors.tokenAmount && errors.tokenAmount.message}
          error={!!errors.tokenAmount}
          placeholder={`Enter amount for ${
            getValues("tokenName") ?? "{token}"
          }`}
          // {t('loan:loan-details.tokens-placeholder', {
          // 	token: getValues('tokenName'),
          // })}
          tokenName={getValues("tokenName")}
        />

        <Flex sx={{ flexDirection: ["column", "row"], gap: [0, "16px"] }}>
          <TextInputField
            label="Interest rate offered" // {t('loan:loan-details.interest-rate-label')}
            id="interestRate"
            {...register("interestRate")}
            fieldError={
              errors.interestRate && `${errors?.interestRate?.message}`
              // t(`common:errors.${errors?.interestRate?.message}`)
            }
            iconRight={<div>%</div>}
            error={!!errors.interestRate}
            placeholder="" // {t('loan:loan-details.interest-rate-placeholder')}
          />

          <TextInputField
            label="Loan period" // {t('loan:loan-details.interest-rate-label')}
            // label="" // {t('loan:loan-details.loan-period-label')}
            id="loanPeriod"
            {...register("loanPeriod")}
            fieldError={
              errors.loanPeriod && `${errors?.loanPeriod?.message}`
              // t(`common:errors.${errors?.loanPeriod?.message}`)
            }
            error={!!errors.loanPeriod}
            placeholder="" // {t('loan:loan-details.loan-period-placeholder')}
          />
        </Flex>

        <TextAreaField
          label="" // {t('loan:loan-details.text-area-label')}
          id="comment"
          {...register("comment")}
          style={{ height: "128px" }}
          placeholder="" // {t('loan:loan-details.text-area-placeholder')}
        />
      </ContentCard>

      {/* Footer Navigation Section */}
      <NavigationFooter
        goBackStep={goBackStep}
        goNextStep={goNextStep}
        isNextButtonDisabled={!isValid}
      />
    </ContentCardWrapper>
  );
}
