import { ActionIntercept, BuilderFieldExtensions, BuilderModelExtensions, BuilderRef, CHANGE, FieldRef, InterceptRef, ViewModelRef } from '@dynamic/builder';
import { ComponentBuilder, builderContext } from '@dynamic/plugin';
import { get } from 'lodash';

@ComponentBuilder({
  configAction: 'loadConfig',
  context: builderContext
})
export class BuilderTest {
  loadProposal() {
    return { };
  }

  private filter(resource: any[] = [], viewModel: any) {
    const result: any[] = [];
    resource.forEach(({ filter = [], option }: any) => {
      if (filter.some((obj: any) => Object.keys(obj).every((key) => (obj[key] === 'N/A' ? [null, undefined, ''] : [obj[key]]).includes(get(viewModel, key))))) {
        result.push(option);
      }
    });
    return result;
  }

  peCalculator(@InterceptRef() intercept: ActionIntercept, @BuilderRef() builder: BuilderModelExtensions) {
    return intercept.invoke({ type: 'peCalculator' }, { builder, id: builder.id as string }, {  });
  }

  fieldVisibility(@FieldRef('field.visibility-params') resource: any[], @ViewModelRef() viewModel: any) {
    return this.filter(resource, viewModel)[0];
  }

  loadSource(@FieldRef('field.source-params') resource: any[] = [], @ViewModelRef() viewModel: any) {
    return this.filter(resource, viewModel);
  }

  dynamicLayout(@FieldRef('field.layout-params') resource: any[], @FieldRef('layout') layout: any, @ViewModelRef() viewModel: any) {
    return this.filter(resource, viewModel)[0] || layout;
  }

  dataCombination(
    @ViewModelRef() viewModel: any,
    @InterceptRef() intercept: ActionIntercept,
    @BuilderRef() builder: BuilderModelExtensions,
    @FieldRef() builderField: BuilderFieldExtensions,
    @FieldRef('field.combination-source') resource: any[] = []
  ) {
    const { events } = builderField;
    const [result] = this.filter(resource, viewModel);
    events.onChange ? events.onChange(result) : intercept.invoke({ type: CHANGE }, { builder, id: builderField.id }, result);
  }

  loadConfig() {
    return {
      grid: {
        spacing: 20
      },
      actions: {
        load: 'loadProposal'
      },
      fields: [
        {
          id: 'base-plan',
          type: 'text',
          label: 'Base plan',
          text: 'Manulife SmartRetire (V)',
          layout: { column: 6 }
        },
        {
          id: 'benefit-type',
          type: 'select',
          label: 'Benefit type',
          binding: { path: 'basePlan.benefitType' },
          layout: { row: 2, column: 6 },
          dataSource: {
            source: [
              { value: 'targetRetirementSum', label: 'Target retirement sum' },
              { value: 'targetRetirementIncome', label: 'Target retirement income' }
            ]
          }
        },
        {
          id: 'target-retirement-age',
          type: 'select',
          label: 'Target retirement age',
          binding: { path: 'basePlan.targetRetirementAge' },
          layout: { row: 2, column: 6 },
          checkVisibility: {
            action: 'fieldVisibility',
            dependents: [{ fieldId: 'benefit-type', type: 'change' }]
          },
          'visibility-params': [
            {
              filter: [{ 'basePlan.benefitType': 'N/A' }],
              option: 'none'
            }
          ],
          dataSource: {
            source: [
              { value: 40, label: 40 }, 
              { value: 45, label: 45 },
              { value: 50, label: 50 }, 
              { value: 55, label: 55 },
              { value: 60, label: 60 }, 
              { value: 65, label: 65 },
              { value: 70, label: 70 }
            ]
          }
        },
        {
          id: 'options',
          type: 'select',
          label: 'Options',
          binding: { path: 'basePlan.option' },
          layout: { row: 3, column: 6 },
          checkVisibility: {
            action: 'fieldVisibility',
            dependents: [
              { fieldId: 'benefit-type', type: 'change' },
              { fieldId: 'target-retirement-age', type: 'change' }
            ]
          },
          'visibility-params': [
            {
              filter: [{ 'basePlan.benefitType': 'targetRetirementSum', 'basePlan.targetRetirementAge': 'N/A' }],
              option: 'disabled'
            },
            {
              filter: [{ 'basePlan.targetRetirementAge': 'N/A' }],
              option: 'none'
            }
          ],
          dataSource: {
            action: 'loadSource',
            dependents: [{ fieldId: 'benefit-type', type: 'change' }]
          },
          'source-params': [
            {
              filter: [{ 'basePlan.benefitType': 'targetRetirementSum' }],
              option: { value: 'inputTRS', label: 'Input target retirement sum' }
            },
            { 
              filter: [{ 'basePlan.benefitType': 'targetRetirementIncome' }],
              option: { value: 'inputTRI', label: 'Input target retirement income' }
            },
            { 
              filter: [{ 'basePlan.benefitType': 'targetRetirementSum' }, { 'basePlan.benefitType': 'targetRetirementIncome' }],
              option: { value: 'inputPC', label: 'Input premium contribution' }
            }
          ]
        },
        {
          id: 'target-retirement-sum',
          type: 'input-decimal',
          label: 'Target retirement sum',
          binding: { path: 'basePlan.baseProtection', default: 0 },
          layout: { row: 4, column: 6 },
          actions: {
            change: 'peCalculator'
          },
          checkVisibility: {
            action: 'fieldVisibility',
            dependents: [{ fieldId: 'options', type: 'change' }]
          },
          'visibility-params': [
            {
              filter: [{ 'basePlan.option': 'N/A' }],
              option: 'none'
            }
          ],
          minAmount: 0,
          '#maxAmount': {
            action: 'loadSource',
            dependents: [{ fieldId: 'options', type: 'change' }]
          },
          'source-params': [
            {
              filter: [{ 'basePlan.option': 'inputTRS' }],
              option: 10000
             },
             {
              filter: [{ 'basePlan.option': 'inputTRI' }],
              option: 50000
             },
             {
              filter: [{ 'basePlan.option': 'inputPC' }],
              option: 1000000
             }
          ],
          maxLengthInput: 7
        },
        {
          id: 'premium-mode',
          type: 'text',
          label: 'Premium mode',
          text: 'Annual',
          layout: { row: 4, column: 6 },
          checkVisibility: {
            action: 'fieldVisibility',
            dependents: [{ fieldId: 'options', type: 'change' }]
          },
          'visibility-params': [
            {
              filter: [{ 'basePlan.option': 'N/A' }],
              option: 'none'
            }
          ]
        },
        {
          id: 'minimum-investment-period',
          type: 'text',
          label: 'Minimum investment period(MIP)',
          text: '-',
          '#text': {
            action: 'fieldVisibility',
            dependents: [{ type: 'peCalculator' }]
          },
          'visibility-params': [
            {
              filter: [{ 'basePlan.option': 'N/A' }],
              option: '-'
             },
            {
              filter: [{ 'basePlan.option': 'inputTRS' }],
              option: 'inputTRS'
             },
             {
              filter: [{ 'basePlan.option': 'inputPC' }],
              option: 'inputPC'
             }
          ],
          layout: { row: 5, column: 6 }
        },
        {
          id: 'premium-contribution',
          type: 'text',
          label: 'Premium contribution',
          text: 'Annual',
          layout: { row: 6, column: 6 }
        }
      ]
    };
  }
}

