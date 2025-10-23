package com.legipilot.service.core.administrator.domain.model;

import com.legipilot.service.core.administrator.authentication.domain.Authentication;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministrator;
import com.legipilot.service.core.administrator.domain.command.ModifyAdministratorWithCompanyDetails;
import com.legipilot.service.core.administrator.domain.command.SignUp;
import com.legipilot.service.core.company.domain.model.Company;
import lombok.*;
import lombok.experimental.Accessors;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Builder
@Getter
@Accessors(fluent = true)
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class Administrator {
    private final UUID id;
    private String email;
    private String firstname;
    private String lastname;
    private String phone;
    private Fonction fonction;
    private Boolean isNewsViewed;
    private Boolean isNotifViewed;
    private EncodedPassword password;
    private final Authentication authentication;
    private AccountState state;
    private Optional<String> picture;
    private List<Role> roles;
    private List<Company> companies;

    public static Administrator signup(SignUp command) {
        return Administrator.builder()
                .authentication(command.authentication())
                .email(command.email())
                .password(new EncodedPassword(command.password().encodedValue()))
                .firstname(command.firstName())
                .lastname(command.lastName())
                .picture(command.picture())
                .phone(command.phone())
                .fonction(Fonction.fromLabel(command.fonction()))
                .roles(List.of(Role.ADMIN))
                .companies(new ArrayList<>())
                .state(AccountState.NOT_VALIDATED)
                .build();
    }

    public void associateCompany(Company createdCompany) {
        this.companies.add(createdCompany);
    }

    public void activate() {
        this.state = AccountState.ACTIVE;
    }

    public void modify(ModifyAdministrator command) {
        command.firstname().ifPresent(firstname -> this.firstname = firstname);
        command.lastname().ifPresent(lastname -> this.lastname = lastname);
        command.email().ifPresent(email -> this.email = email);
        command.phone().ifPresent(phone -> this.phone = phone);
        command.fonction().ifPresent(fonction -> this.fonction = fonction);
        command.isNewsViewed().ifPresent(isNewsViewed -> this.isNewsViewed = isNewsViewed);
        command.isNotifViewed().ifPresent(isNotifViewed -> this.isNotifViewed = isNotifViewed);
    }

    public void modifyPicture(ExposedFile file) {
        this.picture = Optional.of(file.url());
    }

    public void modifyPassword(Password newPassword) {
        this.password = new EncodedPassword(newPassword.encodedValue());
    }
}
