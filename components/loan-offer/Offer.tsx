import { Button, Card } from '../ui'
// import { useTranslation } from 'next-i18next'
import React from 'react'
import { Flex } from 'theme-ui'
import { useFormContext } from 'react-hook-form'
import { TextAreaField, TextInputField, TokenInputField } from '../form'
import { Title, Subtitle } from './styled'

export default function Offer() {
	// const { t } = useTranslation(['common', 'loan', 'loan-listings'])
	const {
		getValues,
		register,
		formState: { isValid, errors },
	} = useFormContext()

	return (
		<Card sx={{ flexDirection: 'column', p: '16px', gap: '16px' }}>
			<Flex sx={{ flexDirection: 'column', gap: '2px' }}>
				<Title>{t('loan-listings:loan-counter.offer-title')}</Title>
				<Subtitle>
					{/* {t('loan-listings:loan-counter.offer-subtitle')} */}
					Enter the details here and we&apos;ll send it to the user.
					</Subtitle>
			</Flex>

			<Flex sx={{ flexDirection: 'column' }}>
				<TokenInputField
					label='Loan amount' //{t('loan-listings:loan-counter.token-label')}
					id='tokenAmount'
					{...register('tokenAmount')}
					fieldError={`${errors.tokenAmount?.message}`}
					// {
					// 	errors.tokenAmount && t(`common:errors.${errors.tokenAmount.message}`)
					// }
					error={!!errors.tokenAmount}
					placeholder={getValues('tokenName')} 
					// {t('loan:loan-details.tokens-placeholder', {
					// 	token: getValues('tokenName'),
					// })}
					tokenName={getValues('tokenName')}
				/>

				<Flex sx={{ flexDirection: ['column', 'row'], gap: [0, '16px'] }}>
					<TextInputField
						label="Interest rate offered"  // {t('loan:loan-details.interest-rate-label')}
						id='interestRate'
						{...register('interestRate')}
						fieldError={
							errors.interestRate &&
							// t(`common:errors.${errors?.interestRate?.message}`)
							`${errors?.interestRate?.message}`
						}
						iconRight={<div>%</div>}
						error={!!errors.interestRate}
						placeholder="Enter interest rate" //{t('loan:loan-details.interest-rate-placeholder')}
					/>

					<TextInputField
						label={t('loan:loan-details.loan-period-label')}
						id='loanPeriod'
						{...register('loanPeriod')}
						fieldError={
							// errors.loanPeriod && t(`common:errors.${errors?.loanPeriod?.message}`)
							`${errors?.loanPeriod?.message}`
						}
						error={!!errors.loanPeriod}
						placeholder="Enter loan period in days"  //{t('loan:loan-details.loan-period-placeholder')}
					/>
				</Flex>
				<TextAreaField
					label="Write a comment" // {t('loan:loan-details.text-area-label')}
					id='comment'
					{...register('comment')}
					style={{ height: '128px' }}
					placeholder='Enter Text' // {t('loan:loan-details.text-area-placeholder')}
				/>
			</Flex>

			<Button
				disabled={!isValid}
				type='submit'
				variant='gradient'
				size='extraLarge'
			>
				{/* {t('loan-listings:loan-counter.review-offer')} */}
				Review Offer
			</Button>
		</Card>
	)
}
