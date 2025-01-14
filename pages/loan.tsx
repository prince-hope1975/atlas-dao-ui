import React, { useState } from "react";
import { Text } from "theme-ui";
// import { useTranslation } from 'next-i18next'
import NiceModal from "@ebay/nice-modal-react";
import { yupResolver } from "@hookform/resolvers/yup";

import LoanBackgroundBlob from "../assets/images/TradeBackgroundBlob";
import LoanBackgroundLogo from "../assets/images/TradeBackgroundLogo";

import {
  SelectNFTs,
  BodyContainer,
  Container,
  HeaderContainer,
  HeaderSubtitleContainer,
  HeaderTitle,
  HeaderTitleContainer,
  MobileStepsWrapper,
  StepsWrapper,
  LoanBackgroundBlobContainer,
  LoanBackgroundLogoContainer,
  ConfirmListing,
} from "@/components/loan";

import { CREATE_LOAN_LISTING_FORM_STEPS } from "@/constants/steps";
import { useStep } from "@/hooks/react/useStep";
// import { makeStaticPaths, makeStaticProps } from 'lib'
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import * as ROUTES from "@/constants/routes";
import useHeaderActions from "@/hooks/useHeaderActions";
import { TxReceipt } from "@/services/blockchain/blockchain.interface";

import { LoanFormStepsProps } from "@/types";
import {
  LoanDetailsStepSchema,
  SelectNFTStepSchema,
} from "@/constants/validation-schemas/loan";
import { LoanDetails } from "@/components/loan/LoanDetails";
import { LoansContract } from "@/services/blockchain";
import { LoansService } from "@/services/api/loansService";
import { TxBroadcastingModal } from "@/components/shared";
import { LayoutContainer, Page } from "@/components/layout";
import { MobileSteps, Steps } from "@/components/ui";
import { ExitCreateLoanListing } from "@/components/shared/header-actions/exit-create-loan-listing";
import { CHAIN_NAMES, getNetworkName } from "@/utils/blockchain/networkUtils";
import { NFTLoansMessageComposer } from "@/services/blockchain/contracts/loans/NFTLoans.message-composer";
import { NFTLoansQueryClient } from "@/services/blockchain/contracts/loans/NFTLoans.client";
import { useChain } from "@cosmos-kit/react";

// const getStaticProps = makeStaticProps(['common', 'loan'])
// const getStaticPaths = makeStaticPaths()
// export { getStaticPaths, getStaticProps }

export default function Loan() {
  const { sign, getSigningCosmWasmClient, address, getCosmWasmClient } =
    useChain(CHAIN_NAMES[1]);
  // const { t } = useTranslation(['common', 'loan'])
  useHeaderActions(<ExitCreateLoanListing />);
  const [
    selectNFTsLabel,
    loanDetailsLabel,
    confirmListingLabel,
  ]: Array<string> =
    // t('loan:steps', {
    // 	returnObjects: true,
    // })
    ["Select NFTs", "Loan Details", "Confirm Listing"];

  const [step, { goToNextStep, goToPrevStep, canGoToNextStep, setStep }] =
    useStep(3 );
  const [steps] = useState([
    {
      id: CREATE_LOAN_LISTING_FORM_STEPS.SELECT_NFTS,
      label: selectNFTsLabel,
    },
    {
      id: CREATE_LOAN_LISTING_FORM_STEPS.LOAN_DETAILS,
      label: loanDetailsLabel,
    },
    {
      id: CREATE_LOAN_LISTING_FORM_STEPS.CONFIRM_LISTING,
      label: confirmListingLabel,
    },
  ]);

  const getStepSchema = (currentStep: 1 | 2) => {
    const formSchemas = {
      [CREATE_LOAN_LISTING_FORM_STEPS.SELECT_NFTS]: SelectNFTStepSchema,
      [CREATE_LOAN_LISTING_FORM_STEPS.LOAN_DETAILS]: LoanDetailsStepSchema,
    };

    return formSchemas[currentStep] ?? SelectNFTStepSchema;
  };

  const formMethods = useForm<LoanFormStepsProps>({
    mode: "onChange",
	
    resolver: yupResolver(getStepSchema(step)),
    defaultValues: {
      selectedNFTs: [],
      isSuccessScreen: false,
      tokenName: "Stars",
    },
  });

  const onSubmit: SubmitHandler<LoanFormStepsProps> = async ({
    coverNFT,
    selectedNFTs,
    loanPeriod,
    interestRate,
    tokenAmount,
    comment,
  }) => {
    const client = await getCosmWasmClient();
    const loanClient = new NFTLoansQueryClient(client, address!);
    //   getSigningCosmWasmClient,
    //   {
    //     gas: 1_000_000,
    //     address: address!,
    //   };
    const data: {
      action: string;
      loanId: string;
      borrower: string;
    } & TxReceipt = await NiceModal.show(TxBroadcastingModal, {
      transactionAction: LoansContract.createLoanListing(
        {
          address: address!,
          nfts: selectedNFTs,
          durationInDays: loanPeriod,
          interestRate: interestRate,
          amountNative: tokenAmount,
          previewNFT: coverNFT,
          comment,
          client: getSigningCosmWasmClient,
        }
        // selectedNFTs,
        // loanPeriod,
        // interestRate,
        // tokenAmount,
        // coverNFT,
        // comment
      ),
      closeOnFinish: true,
    });

    if (data) {
      const { loanId, explorerUrl, borrower } = data;

      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "";
      formMethods.setValue(
        "loanDetailsUrl",
        `${origin}${ROUTES.LOAN_LISTING_DETAILS}?loanId=${loanId}&borrower=${borrower}`
      );
      formMethods.setValue("explorerUrl", explorerUrl);
      formMethods.setValue("isSuccessScreen", true);

      // NOTE: backend is doing refetch on it's own,over sockets, but trigger for safety
      await LoansService.getLoan(getNetworkName(), loanId, borrower);
    }
  };

  return (
    <Page
      title="Create A Loan Agreement" // {t('common:title')}
    >
      <LayoutContainer>
        <LoanBackgroundLogoContainer>
          <LoanBackgroundLogo />
        </LoanBackgroundLogoContainer>
        <LoanBackgroundBlobContainer>
          <LoanBackgroundBlob />
        </LoanBackgroundBlobContainer>
        <Container>
          <HeaderContainer>
            <HeaderTitleContainer>
              <HeaderTitle>
                {/* {t('loan:title')} */}
                Loan NFTs
              </HeaderTitle>
            </HeaderTitleContainer>
            {/* Only Mobile And Tablet */}
            <HeaderSubtitleContainer>
              <Text color="gray1000" variant="textMdBold">
                {`${step}/${steps.length}`}
              </Text>
            </HeaderSubtitleContainer>
          </HeaderContainer>

          {/* FORM STARTS HERE */}
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <BodyContainer>
                {/* Only on Mobile and Tablet */}
                <MobileStepsWrapper>
                  <MobileSteps steps={steps} currentStep={step} />
                </MobileStepsWrapper>

                {/* Only on Laptop and Desktop */}
                <StepsWrapper>
                  <Steps steps={steps} currentStep={step} />
                </StepsWrapper>

                {/* STEP 1 */}
                {step === CREATE_LOAN_LISTING_FORM_STEPS.SELECT_NFTS && (
                  <SelectNFTs
                    goBackStep={goToPrevStep}
                    goNextStep={goToNextStep}
                  />
                )}

                {/* STEP 2 */}
                {step === CREATE_LOAN_LISTING_FORM_STEPS.LOAN_DETAILS && (
                  <LoanDetails
                    goBackStep={goToPrevStep}
                    goNextStep={goToNextStep}
                  />
                )}

                {/* STEP 3 */}
                {step === CREATE_LOAN_LISTING_FORM_STEPS.CONFIRM_LISTING && (
                  <ConfirmListing
                    canGoToNextStep={canGoToNextStep}
                    goBackStep={goToPrevStep}
                    setStep={setStep}
                  />
                )}
              </BodyContainer>
            </form>
          </FormProvider>
        </Container>
      </LayoutContainer>
    </Page>
  );
}
