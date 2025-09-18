package com.legipilot.service.core.company.infra.out;

import com.legipilot.service.core.collaborator.domain.model.PersonalSituation;
import com.legipilot.service.shared.infra.out.database.StringListConvertor;
import jakarta.persistence.Convert;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Embeddable
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalSituationDto {

    private String maritalStatus;
    private String educationLevel;
    private Integer numberOfChildren;

    @Convert(converter = StringListConvertor.class)
    private List<String> drivingLicenses;

    private Boolean rqth;

    public static PersonalSituationDto from(PersonalSituation domain) {
        return PersonalSituationDto.builder()
                .maritalStatus(domain.maritalStatus())
                .numberOfChildren(domain.numberOfChildren())
                .educationLevel(domain.educationLevel())
                .drivingLicenses(Objects.isNull(domain.drivingLicenses()) ? new ArrayList<>() : domain.drivingLicenses())
                .rqth(domain.rqth())
                .build();
    }

    public PersonalSituation toDomain() {
        return PersonalSituation.builder()
                .maritalStatus(maritalStatus)
                .numberOfChildren(numberOfChildren)
                .educationLevel(educationLevel)
                .drivingLicenses(drivingLicenses)
                .rqth(rqth)
                .build();
    }
}
