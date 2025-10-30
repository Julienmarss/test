package com.legipilot.service.core.collaborator.events.domain.calculation;

import com.legipilot.service.core.collaborator.events.domain.model.trigger.FieldValue;
import com.legipilot.service.core.collaborator.events.domain.model.trigger.TriggeredEvent;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class DefaultAutomaticFieldCalculator implements AutomaticFieldCalculator {

    @Override
    public Object computeFieldValue(TriggeredEvent triggeredEvent, FieldValue field) {
        return switch (field.fieldId().value()) {
            case "dismissal_compensation" ->
                // Indemnité de licenciement
                // règle métier : "Calcul selon le plus favorable 1/12 ou 1/3 et ancienneté"
                // TODO: implémenter le calcul à partir de triggeredEvent
                computeDismissalCompensation(triggeredEvent);
            case "conventional_dismissal_compensation" ->
                // Indemnité conventionnelle de licenciement
                // règle métier : "Selon CCN et catégorie d'emploi"
                // TODO: implémenter le calcul à partir de triggeredEvent
                computeConventionalDismissalCompensation(triggeredEvent);
            case "paid_leave_compensation" ->
                // Indemnité de congé payé
                // règle métier : "Méthode du 1/10ème vs maintien (le plus favorable)"
                // TODO: implémenter le calcul à partir de triggeredEvent
                computePaidLeaveCompensation(triggeredEvent);
            default ->
                // Champ pas censé être auto-calculé (ou pas encore géré)
                // On renvoie null ou on pourrait renvoyer la valeur actuelle inchangée
                null;
        };
    }

    private Object computeDismissalCompensation(TriggeredEvent triggeredEvent) {
        Double avg12Months = findNumericField(triggeredEvent, "avg_12_months");
        Double avg3Months = findNumericField(triggeredEvent, "avg_3_months");
        Double seniorityYear = findNumericField(triggeredEvent, "seniority_year");
        Double seniorityMonths = findNumericField(triggeredEvent, "seniority_months");

        if (avg12Months == null || avg3Months == null || seniorityYear == null || seniorityMonths == null) {
            return null;
        }

        // Pas d'indemnité si inférieur à 8 mois d'ancienneté
        if(seniorityYear == 0 && seniorityMonths < 8) return 0.0;

        Double bestWage = avg12Months > avg3Months ? avg12Months : avg3Months;
        Double amount = 0.0;

        // Ancienneté totale en années décimales
        double totalSeniorityYears = seniorityYear + (seniorityMonths / 12.0);

        if (totalSeniorityYears <= 10.0) {
            // Moins ou égal à 10 ans :
            // indemnité = 1/4 mois salaire * total années
            amount = bestWage * (0.25 * totalSeniorityYears);
        } else {
            // Plus de 10 ans :
            // - 1/4 par an sur les 10 premières années
            // - 1/3 par an sur le reste
            double firstPartYears = 10.0;
            double extraYears = totalSeniorityYears - 10.0;

            double firstPart = bestWage * (0.25 * firstPartYears); // 1/4 pour les 10 premières années
            double extraPart = bestWage * (1.0 / 3.0 * extraYears); // 1/3 pour le reste

            amount = firstPart + extraPart;
        }

        return amount;
    }

    private Object computeConventionalDismissalCompensation(TriggeredEvent triggeredEvent) {
        // TODO: typiquement dépend de:
        // - collective_agreement
        // - employment_category
        // - ancienneté
        // - salaires de référence
        return null;
    }

    private Object computePaidLeaveCompensation(TriggeredEvent triggeredEvent) {
        // TODO:
        // - remaining_paid_leave
        // - acquired_paid_leave
        // - usual_monthly_salary
        // - méthode 1/10e vs maintien
        return null;
    }

    private Double findNumericField(TriggeredEvent triggeredEvent, String fieldIdValue) {
        if (triggeredEvent.actionsData() == null) {
            return null;
        }

        return triggeredEvent.actionsData().stream()
                .filter(actionData -> actionData.fieldValues() != null)
                .flatMap(actionData -> actionData.fieldValues().stream())
                .filter(fieldValue -> fieldValue.fieldId() != null && fieldIdValue.equals(fieldValue.fieldId().value()))
                .map(FieldValue::value)
                .map(this::toDouble)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    private Double toDouble(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        if (value instanceof String str && !str.isBlank()) {
            try {
                return Double.parseDouble(str.replace(',', '.'));
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }
}
