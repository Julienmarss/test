package com.legipilot.service.shared.infra.security;

import com.legipilot.service.core.administrator.domain.model.CompanyRight;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresCompanyRight {
    CompanyRight value();
    String companyIdParam() default "";
}